/* istanbul ignore file */
import {ReactNode, DOMAttributes, SyntheticEvent} from 'react';
import {OutputSyntaxElement, OutputContainerNode} from '@otakustay/source-tokenizer';

export type RenderSyntaxTree = (root: OutputContainerNode, defaultRender: RenderSyntaxElement, i: number) => ReactNode;

export type RenderSyntaxElement = (element: OutputSyntaxElement, i: number) => ReactNode;

type DOMEvents = Omit<DOMAttributes<HTMLTableCellElement>, 'children' | 'dangerouslySetInnerHTML'>;

export type EventAttributes = {[K in keyof DOMEvents]?: (line: number, e: SyntheticEvent) => void};

export type RenderGutter = (line: number) => ReactNode;
