import {
    FlameChartContainer,
    FlameChartNodes,
    FlameChartPlugin,
    FlameChartStyles,
    TimeGridPlugin,
    TogglePlugin,
    UIPlugin,
} from '../../../../src';
import { FlameChartContainerStyles } from '../../../../src/flame-chart-container';
import styles from './default-flame-chart.module.css';
import { FlameChartContainerComponent } from '../../../../src/wrappers/react/flame-chart-container-component';
import { useEffect, useMemo, useState } from 'react';

export type CustomFlameChartProps = {
    flameChartData?: FlameChartNodes[];
    stylesSettings?: FlameChartContainerStyles<FlameChartStyles>;
};

export const CustomFlameChart = ({ flameChartData = [], stylesSettings }: CustomFlameChartProps) => {
    const [instance, setInstance] = useState<null | FlameChartContainer>(null);
    
    const flameChartPlugins = useMemo(
        () => {
            let res: FlameChartPlugin[] = [  ];
            for (let i = 0; i < flameChartData.length; i++) {
                res.push(new FlameChartPlugin({
                    name: "Thread-" + i,
                    data: flameChartData[i],
                }));
            }
            return res;
        },
        [],
    );

    const plugins = useMemo(
        () => {
            let res: UIPlugin[] = [ new TimeGridPlugin() ];
            for (let i = 0; i < flameChartData.length; i++) {
                res.push(new TogglePlugin("Thread-" + i));
                res.push(flameChartPlugins[i]);
            }    
            return res;
        },
        [],
    ); 

    useEffect(() => {
        console.info("useEffect");
        if (instance) {
            let charts = flameChartData[0];
            for (let i = 0; i < charts.length; i++) {
                console.info("Chart2:" , charts[i]);
                // flameChartPlugins[i].setData([ charts[i] ]); // this breaks.... for some reason...
            }

            /* flameChartPlugins[0].setData(flameChartData[0]);
            flameChartPlugins[1].setData(flameChartData[1]);
            flameChartPlugins[2].setData(flameChartData[0]);
            flameChartPlugins[3].setData(flameChartData[1]); */
        }
    }, [flameChartData, instance]);

    const settings = useMemo(
        () => ({
            styles: stylesSettings,
        }),
        [stylesSettings],
    );

    return (
        <FlameChartContainerComponent
            settings={settings}
            instance={setInstance}
            plugins={plugins}
            className={styles.flameChart}
        />
    );
};
