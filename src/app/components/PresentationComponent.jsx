import { useEffect, useState } from 'react';
import { socket } from '../lib/socket';
import { useStore } from '../store/store';
import Canvas from './Canvas';
import PlayersButtonList from './PlayersButtonList';

function PresentationComponent() {
    const [data, setData] = useState([]);
    const { isLeader } = useStore();

    // useEffect(() => {
    //     const handleData = ({ data }) => {
    //         setData(null);
    //         // let index = 0;

    //         // const interval = setInterval(() => {
    //         //     if (index < data.length) {
    //         //         const item = data[index];
    //         //         const uniqueKey = typeof item === 'string' ? item : `canvas-${index}`;
    //         //         console.log(item);

    //         //         if (typeof item === 'string') {
    //         //             content.push(<h2 key={uniqueKey}>{item}</h2>);
    //         //         } else if (item === null) {
    //         //             content.push(<h2>Без комментариев</h2>);
    //         //         } else {
    //         //             content.push(<Canvas key={uniqueKey} data={item} />);
    //         //         }

    //         //         setData([...content]);
    //         //         index++;
    //         //     } else {
    //         //         clearInterval(interval);
    //         //     }
    //         // }, 1000);
    //         console.log(data);
    //         let content;
    //         if (typeof data === 'string') {
    //             content = <h2>{data}</h2>;
    //         } else if (data === null) {
    //             content = <h2>Без комментариев</h2>;
    //         } else {
    //             content = <Canvas data={data} />;
    //         }
    //         // const content = data.map((item, index) => {

    //         // });
    //         setData(content);
    //     };
    useEffect(() => {
        const handleData = ({ data }) => {
            setData((prevData) => [
                ...prevData,
                typeof data === 'string' ? <h2>{data}</h2> : <Canvas data={data} />,
            ]);
        };

        const handleClear = () => {
            setData('');
        };

        socket.on('userContentArray', handleData);
        socket.on('clear', handleClear);

        return () => {
            socket.off('userContentArray', handleData);
            socket.off('clear', handleClear);
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
