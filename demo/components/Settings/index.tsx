import {cloneElement, FC, useCallback, CSSProperties, ReactElement} from 'react';
import {Select, Checkbox} from 'antd';
import {CheckboxChangeEvent} from 'antd/es/checkbox/index.js';
import DebouncedInput from '../DebouncedInput/index.js';
import c from './index.less';

const {Option} = Select;

export interface SourceSettings {
    keyword: string;
    language?: string;
    markTab: boolean;
    markCarriageReturn: boolean;
    wrapLine: boolean;
}

interface FieldProps {
    title?: string;
    style?: CSSProperties;
    children: ReactElement;
}

const Field: FC<FieldProps> = ({title, style, children}) => (
    <div className={c.field} style={style}>
        {title && <span className={c.title}>{title}:</span>}
        {cloneElement(children, {className: c.content})}
    </div>
);

interface Props {
    value: SourceSettings;
    onChange(settings: SourceSettings): void;
}


const Settings: FC<Props> = ({value, onChange}) => {
    const {language = 'text', wrapLine, markTab, markCarriageReturn} = value;
    const udpateLanguage = useCallback(
        (language: string) => onChange({...value, language: language === 'text' ? undefined : language}),
        [value, onChange]
    );
    const updateWrapLine = useCallback(
        (e: CheckboxChangeEvent) => onChange({...value, wrapLine: e.target.checked}),
        [value, onChange]
    );
    const updateKeyword = useCallback(
        (keyword: string) => onChange({...value, keyword}),
        [value, onChange]
    );
    const updateMarkTab = useCallback(
        (e: CheckboxChangeEvent) => onChange({...value, markTab: e.target.checked}),
        [value, onChange]
    );
    const updateMarkCarriageReturn = useCallback(
        (e: CheckboxChangeEvent) => onChange({...value, markCarriageReturn: e.target.checked}),
        [value, onChange]
    );

    return (
        <div className={c.root}>
            <Field title="Language" style={{width: 200}}>
                <Select value={language} onChange={udpateLanguage}>
                    <Option value="text">Plain Text</Option>
                    <Option value="javascript">JavaScript</Option>
                    <Option value="typescript">TypeScript</Option>
                    <Option value="php">PHP</Option>
                    <Option value="java">Java</Option>
                </Select>
            </Field>
            <Field title="Search" style={{width: 320}}>
                <DebouncedInput onChange={updateKeyword} />
            </Field>
            <Field>
                <Checkbox checked={wrapLine} onChange={updateWrapLine}>
                    Wrap Line
                </Checkbox>
            </Field>
            <Field>
                <Checkbox checked={markTab} onChange={updateMarkTab}>
                    Mark Tab
                </Checkbox>
            </Field>
            <Field>
                <Checkbox checked={markCarriageReturn} onChange={updateMarkCarriageReturn}>
                    Mark Carraige Return
                </Checkbox>
            </Field>
        </div>
    );
};

export default Settings;
