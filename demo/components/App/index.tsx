import {useState, FC} from 'react';
import DebouncedInput from '../DebouncedInput/index.js';
import SourceView from '../SourceView/index.js';
import Settings, {SourceSettings} from '../Settings/index.js';
import c from './index.less';

const DEFAULT_SETTINGS: SourceSettings = {
    keyword: '',
    wrapLine: false,
    markTab: false,
    markCarriageReturn: false,
};

const App: FC = () => {
    const [source, setSource] = useState('');
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);

    return (
        <div className={c.root}>
            <div style={{marginBottom: 20}}>
                <DebouncedInput is="textarea" rows={12} placeholder="Source code" onChange={setSource} />
            </div>
            <Settings value={settings} onChange={setSettings} />
            {source && <SourceView style={{marginTop: 20}} source={source} {...settings} />}
        </div>
    );
};

export default App;
