import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const publicApiFactories = new Set(['input', 'model', 'output', 'outputFromObservable']);
const bindingExpressions = [
    /\{\{([\s\S]*?)\}\}/gu,
    /[[(][^\]\s=]+[\])]\]?\s*=\s*"([^"]*)"/gu,
    /@(?:if|for|switch|case|else if|let|defer)\b([^{]*)/gu
];

const componentMetadata = classNode => (classNode.decorators ?? [])
    .map(decorator => decorator.expression)
    .find(expression => expression.type === 'CallExpression' && expression.callee.name === 'Component')
    ?.arguments[0];

const metadataValue = (metadata, name) => metadata.properties
    .find(property => property.key?.name === name || property.key?.value === name)?.value;

const markupOf = (metadata, sourceFile) => {
    const templateUrl = metadataValue(metadata, 'templateUrl');
    const template = metadataValue(metadata, 'template');
    const host = metadataValue(metadata, 'host');
    const parts = [];
    if (templateUrl?.type === 'Literal') {
        parts.push(readFileSync(resolve(dirname(sourceFile), templateUrl.value), 'utf8'));
    }
    if (template?.type === 'TemplateLiteral') {
        parts.push(template.quasis.map(quasi => quasi.value.cooked).join(''));
    }
    const hostBindings = host?.type === 'ObjectExpression' ? host.properties : [];
    for (const binding of hostBindings) {
        if (binding.value.type === 'Literal' && /^[[(]/u.test(binding.key.value ?? '')) {
            parts.push(`{{${binding.value.value}}}`);
        }
    }
    return parts.join('\n');
};

const identifiersUsedIn = markup => {
    const identifiers = new Set();
    for (const pattern of bindingExpressions) {
        for (const match of markup.matchAll(pattern)) {
            for (const identifier of match[1].matchAll(/(?<![\w$.])[A-Za-z_$][\w$]*/gu)) {
                identifiers.add(identifier[0]);
            }
        }
    }
    const declaredByMarkup = /#([A-Za-z_$][\w$]*)|\blet\s+([A-Za-z_$][\w$]*)|@for\s*\(\s*([A-Za-z_$][\w$]*)|\bas\s+([A-Za-z_$][\w$]*)/gu;
    for (const match of markup.matchAll(declaredByMarkup)) {
        identifiers.delete(match.slice(1).find(Boolean));
    }
    return identifiers;
};

const isPublicApi = property => property.value?.type === 'CallExpression' &&
    publicApiFactories.has(property.value.callee.name ?? property.value.callee.object?.name);

export default {
    meta: {
        type: 'suggestion',
        docs: { description: 'Component members used by the markup are protected readonly.' },
        messages: { templateMember: 'Member "{{name}}" is used by the markup; declare it "protected readonly".' },
        schema: []
    },
    create: context => {
        const markupIdentifiers = new WeakMap();
        const usedByMarkup = classNode => {
            if (!markupIdentifiers.has(classNode)) {
                const metadata = componentMetadata(classNode);
                markupIdentifiers.set(classNode, metadata?.type === 'ObjectExpression' ?
                    identifiersUsedIn(markupOf(metadata, context.filename)) : new Set());
            }
            return markupIdentifiers.get(classNode);
        };

        return {
            PropertyDefinition: property => {
                const name = property.key.name;
                if (property.static || isPublicApi(property) || !usedByMarkup(property.parent.parent).has(name)) {
                    return;
                }
                if (property.accessibility !== 'protected' || !property.readonly) {
                    context.report({ node: property.key, messageId: 'templateMember', data: { name } });
                }
            }
        };
    }
};
