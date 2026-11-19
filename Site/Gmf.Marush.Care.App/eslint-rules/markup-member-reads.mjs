import {
    AST, ImplicitReceiver, RecursiveAstVisitor, TmplAstElement, TmplAstForLoopBlock,
    TmplAstIfBlockBranch, TmplAstLetDeclaration, TmplAstTemplate, parseTemplate
} from '@angular/compiler';

const skippedKeys = new Set(['i18n', 'file']);
const innerScopeKeys = new Set(['children', 'trackBy']);

class MemberReadCollector extends RecursiveAstVisitor {
    constructor(reads, locals) {
        super();
        this.reads = reads;
        this.locals = locals;
    }

    visitPropertyRead(read, context) {
        if (read.receiver instanceof ImplicitReceiver && !this.locals.has(read.name)) {
            this.reads.add(read.name);
        }
        return super.visitPropertyRead(read, context);
    }
}

export class MarkupMemberReads {
    reads = new Set();

    static of = (template, host, location) => {
        const markup = new MarkupMemberReads();
        markup.collectTemplate(template, location);
        markup.collectHost(host, location);
        return markup.reads;
    };

    collectTemplate = (template, location) => {
        if (template === undefined) {
            return;
        }
        const parsed = parseTemplate(template, location, { preserveWhitespaces: false });
        if (!parsed.errors?.length) {
            this.walkView(parsed.nodes, new Set());
        }
    };

    collectHost = (host, location) => {
        const attributes = host.map(([key, expression]) => `${key}="${expression.replaceAll('&', '&amp;').replaceAll('"', '&quot;')}"`);
        if (attributes.length) {
            this.collectTemplate(`<host-element ${attributes.join(' ')}></host-element>`, location);
        }
    };

    walkView = (nodes, outerLocals) => {
        const locals = new Set(outerLocals);
        this.collectViewLocals(nodes, locals);
        this.walk(nodes, locals);
    };

    collectViewLocals = (nodes, locals) => {
        for (const node of nodes) {
            if (node instanceof TmplAstLetDeclaration) {
                locals.add(node.name);
            }
            if (node instanceof TmplAstElement) {
                node.references.forEach(reference => locals.add(reference.name));
                this.collectViewLocals(node.children, locals);
            }
            if (node instanceof TmplAstTemplate) {
                node.references.forEach(reference => locals.add(reference.name));
            }
        }
    };

    walk = (node, locals) => {
        if (Array.isArray(node)) {
            node.forEach(child => this.walk(child, locals));
            return;
        }
        if (node instanceof AST || node?.ast instanceof AST) {
            (node.ast ?? node).visit(new MemberReadCollector(this.reads, locals));
            return;
        }
        if (node === null || typeof node !== 'object') {
            return;
        }
        const innerLocals = this.viewLocals(node, locals);
        for (const [key, value] of Object.entries(node)) {
            if (key === 'children') {
                this.walkView(value, innerLocals);
            } else if (innerScopeKeys.has(key)) {
                this.walk(value, innerLocals);
            } else if (!skippedKeys.has(key) && !key.endsWith('Span')) {
                this.walk(value, locals);
            }
        }
    };

    viewLocals = (node, locals) => {
        if (node instanceof TmplAstElement) {
            return locals;
        }
        const own = node instanceof TmplAstForLoopBlock ? [node.item, ...node.contextVariables] :
            node instanceof TmplAstTemplate ? node.variables :
            node instanceof TmplAstIfBlockBranch && node.expressionAlias ? [node.expressionAlias] : [];
        return new Set([...locals, ...own.map(variable => variable.name)]);
    };
}
