import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { MarkupMemberReads } from './markup-member-reads.mjs';

const publicApiFactories = new Set(['input', 'model', 'output', 'outputFromObservable']);

const componentMetadata = classNode => (classNode.decorators ?? [])
    .map(decorator => decorator.expression)
    .find(expression => expression.type === 'CallExpression' && expression.callee.name === 'Component')
    ?.arguments[0];

const keyOf = property => property.key?.name ?? property.key?.value;

const properties = objectNode => objectNode?.type === 'ObjectExpression' ?
    objectNode.properties.filter(property => property.type === 'Property') : [];

const metadataValue = (metadata, name) => properties(metadata).find(property => keyOf(property) === name)?.value;

const templateOf = (metadata, sourceFile) => {
    const templateUrl = metadataValue(metadata, 'templateUrl');
    const template = metadataValue(metadata, 'template');
    if (templateUrl?.type === 'Literal') {
        const path = resolve(dirname(sourceFile), templateUrl.value);
        return existsSync(path) ? readFileSync(path, 'utf8') : undefined;
    }
    if (template?.type === 'Literal') {
        return template.value;
    }
    return template?.type === 'TemplateLiteral' ? template.quasis.map(quasi => quasi.value.cooked).join('') : undefined;
};

const hostBindingsOf = metadata => properties(metadataValue(metadata, 'host'))
    .filter(binding => binding.value.type === 'Literal' && /^[[(]/u.test(keyOf(binding) ?? ''))
    .map(binding => [keyOf(binding), binding.value.value]);

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
        const markupReads = new WeakMap();
        const readsOf = classNode => {
            if (!markupReads.has(classNode)) {
                const metadata = componentMetadata(classNode);
                markupReads.set(classNode, metadata?.type === 'ObjectExpression' ?
                    MarkupMemberReads.of(templateOf(metadata, context.filename), hostBindingsOf(metadata), context.filename) :
                    new Set());
            }
            return markupReads.get(classNode);
        };

        return {
            PropertyDefinition: property => {
                const name = property.key.name;
                if (property.static || isPublicApi(property) || !readsOf(property.parent.parent).has(name)) {
                    return;
                }
                if (property.accessibility !== 'protected' || !property.readonly) {
                    context.report({ node: property.key, messageId: 'templateMember', data: { name } });
                }
            }
        };
    }
};
