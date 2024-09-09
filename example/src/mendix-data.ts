import { FlameChartNode, FlameChartNodes } from '../../src';
import mxdata from "./trace.json";

export const generateMendixTrees = (): FlameChartNodes[] => {
    let result: FlameChartNodes[] = [];
    let threadNr = 0;

    let traces: string[] = Object.keys(mxdata);
    traces = traces.sort((left: string, right: string) => {
        return mxdata[left]['start'] - mxdata[right]['start'];
    });
    console.info("order", traces);

    for (let i = 0; i < traces.length; i++) {
        let trace = mxdata[traces[i]];
        if (!trace["duration"]) {
            console.warn("Trace " + traces[i] + " has no duration.");
            continue;   
        }

        if (i > 0) {
            // check if we have overlap with previous tree, if so, increment thread, if not decrement
            if(mxdata[traces[i-1]].end > mxdata[traces[i]].start) {
                threadNr++;
            } else {
                if (threadNr > 0) {
                    while (threadNr > 0) {
                        let upperThread = result[threadNr - 1];
                        if (upperThread[upperThread.length -1].start + upperThread[upperThread.length -1].duration < trace.start)
                            threadNr--;
                        else
                            break;
                    }
                }
            }
        }

        let thread: FlameChartNode[];
        if (typeof result[threadNr] === 'undefined') {
            result[threadNr] = [];
        } 
        thread = result[threadNr];
        

        let flameChartNode: FlameChartNode = {
            name: traces[i],
            start: trace["start"],
            duration: trace["duration"],
            type: 'task',
            children: [ processNode(trace["root"]) ]
        };
        console.info(flameChartNode);
        thread.push(flameChartNode);
        
    }
    console.info("result", result);
    return result;
}

export const generateMendixTree = (): FlameChartNode[] => {
    let result: FlameChartNode[] = [];

    let traces: string[] = Object.keys(mxdata);


    for (let i = 0; i < traces.length; i++) {
        console.info("Chart: "+ traces[i]);
        let trace = mxdata[traces[i]];
        console.info(trace);
        if (!trace["duration"]) continue;

        let flameChartNode: FlameChartNode = {
            name: traces[i],
            start: trace["start"],
            duration: trace["duration"],
            type: 'task',
            children: [ processNode(trace["root"]) ]
        };

        result.push(flameChartNode);
    }
    
    return result;
}

const processNode = (node): FlameChartNode => {
    let flameChartNode: FlameChartNode = {
        name: node["nanoflowName"] ? node["nanoflowName"] : node["type"],
        duration: node["duration"],
        start: node["start"],
        type: node["type"],
        children: []
    };
    for (let i = 0; i < node.children.length; i++) {
        flameChartNode.children?.push(processNode(node.children[i]));
    }

    return flameChartNode;
}
