import {useState, FC} from 'react';
import DebouncedInput from '../DebouncedInput/index.js';
import SourceView from '../SourceView/index.js';
import Settings, {SourceSettings} from '../Settings/index.js';
import c from './index.less';

const App: FC = () => {
    const [source, setSource] = useState('');
    const [settings, setSettings] = useState<SourceSettings>({keyword: '', markTab: false, markCarriageReturn: false});

    return (
        <div className={c.root}>
            <div style={{marginBottom: 20}}>
                <DebouncedInput is="textarea" rows={12} placeholder="Source code" onChange={setSource} />
            </div>
            <Settings value={settings} onChange={setSettings} />
            <div style={{width: 400, overflow: 'auto'}}>
                {source && <SourceView style={{marginTop: 20}} source={source} {...settings} />}
            </div>
        </div>
    );
};

export default App;
