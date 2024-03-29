import {useMemo, FC, ReactNode, CSSProperties, SyntheticEvent, HTMLAttributes} from 'react';
import {OutputLineOfSyntax, OutputSyntaxElement} from '@otakustay/source-tokenizer';
import {RenderSyntaxTree, EventAttributes, RenderGutter} from '../interface/index.js';

interface SourceProps {
    className?: string;
    style?: CSSProperties;
    source?: string;
    syntax?: OutputLineOfSyntax[];
    renderSyntaxTree?: RenderSyntaxTree;
    renderGutter?: RenderGutter;
    lineStart?: number;
    widgets?: {[key: number]: ReactNode};
    gutterEvents?: EventAttributes;
    codeEvents?: EventAttributes;
    selectedLines?: number[];
    wrapLine?: boolean;
}

const mapEventsWith = (events?: EventAttributes) => (line: number): HTMLAttributes<HTMLTableCellElement> => {
    if (!events) {
        return {};
    }

    const entries = Object.entries(events);
    return entries.reduce<HTMLAttributes<HTMLTableCellElement>>(
        (events, [name, fn]) => {
            // @ts-expect-error fix this later
            // eslint-disable-next-line no-param-reassign
            events[name] = (e: SyntheticEvent) => (fn && fn(line, e));
            return events;
        },
        {}
    );
};

const renderGenericElement = (element: OutputSyntaxElement, i: number): ReactNode => {
    if (typeof element === 'string') {
        return element;
    }

    return (
        <span key={i} className={element.properties?.className?.join(' ')}>
            {element.children.map(renderGenericElement)}
        </span>
    );
};

const renderSyntaxContent = (syntax: OutputLineOfSyntax, {renderSyntaxTree}: SourceProps): ReactNode => {
    const render = (element: OutputSyntaxElement, i: number) => {
        if (typeof element === 'string') {
            return element;
        }

        if (renderSyntaxTree) {
            return renderSyntaxTree(element, renderGenericElement, i);
        }

        return renderGenericElement(element, i);
    };

    return syntax.map(render);
};

const renderLineWith = (props: SourceProps) => {
    const {lineStart = 1, widgets = {}, gutterEvents, codeEvents, renderGutter, selectedLines = []} = props;
    const mapGutterEvents = mapEventsWith(gutterEvents);
    const mapCodeEvents = mapEventsWith(codeEvents);
    const selection = new Set(selectedLines);

    return (children: ReactNode[], current: string | OutputLineOfSyntax, i: number): ReactNode[] => {
        const lineNumber = i + lineStart;

        const lineElement = (
            <tr
                key={`line-${lineNumber}`}
                className={selection.has(lineNumber) ? 'source-line source-line-selected' : 'source-line'}
            >
                <td
                    className={`source-gutter source-gutter-${renderGutter ? 'custom' : 'default'}`}
                    data-line-number={lineNumber}
                    {...mapGutterEvents(lineNumber)}
                >
                    {renderGutter && renderGutter(lineNumber)}
                </td>
                <td className="source-code" {...mapCodeEvents(lineNumber)}>
                    {typeof current === 'string' ? current : renderSyntaxContent(current, props)}
                </td>
            </tr>
        );
        children.push(lineElement);

        const widget = widgets[lineNumber];
        if (widget) {
            const widgetContainerElement = (
                <tr key={`widget-${lineNumber}`} className="source-widget">
                    <td colSpan={2}>
                        {widget}
                    </td>
                </tr>
            );
            children.push(widgetContainerElement);
        }

        return children;
    };
};

export const Source: FC<SourceProps> = props => {
    const {source, syntax, className, style, wrapLine} = props;
    const lines = useMemo(() => source?.split('\n') ?? [], [source]);
    const renderLine = renderLineWith(props);
    const classNames = [
        'source',
        wrapLine && 'source-wrap-line',
        className,
    ];

    return (
        <div className={classNames.filter(v => !!v).join(' ')} style={style}>
            <table className="source-content">
                <tbody>
                    {syntax ? syntax.reduce(renderLine, []) : lines.reduce(renderLine, [])}
                </tbody>
            </table>
        </div>
    );
};
