import { useState } from 'react';
import { Tab, Tabs } from '@heroui/tabs'; 
import Map from '../map/Map';
import History from '../history/History';
import './Tabs.css';

const TabArea = () => {
    const sizes = ["sm", "md", "lg"];

    return (
        <div className="body_container">
            <Tabs key="lg" variant="solid">
                <Tab id="tab_1" title="Ye Course">
                    <Map />
                </Tab>
                <Tab id="tab_2" title="Ledger o' Voyages">
                    <History />
                </Tab>
            </Tabs>
        </div>
    )
}

export default TabArea;