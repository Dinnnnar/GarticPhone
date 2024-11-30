import { useEffect, useState } from 'react';
import { socket } from '../lib/socket';
import { useStore } from '../store/store';
import Canvas from './Canvas';
import PlayersButtonList from './PlayersButtonList';

function PresentationComponent() {
    const [data, setData] = useState(null);
    const { isLeader } = useStore();

    useEffect(() => {
        function handleData({ data }) {
            const content = data.map((item, index) => {
                const uniqueKey = typeof item === 'string' ? item : `canvas-${index}`;
                if (typeof item === 'string') {
                    return <h2 key={uniqueKey}>{item}</h2>;
                } else {
                    return <Canvas key={uniqueKey} data={item} />;
                }
            });
            setData(content);
        }

        socket.on('userContentArray', handleData);

        return () => {
            socket.off('userContentArray', handleData);
        };
    }, []);

    return (
        <div className="Presentation">
            <h1>Presentation</h1>
            {isLeader && <PlayersButtonList />}
            {data && data}
        </div>
    );
}

export default PresentationComponent;
