import React, { useState, useEffect } from 'react';
import WebView from 'react-native-webview';
import { getWidgetUrl } from './Widget.helpers';
import decodeUriComponent from 'decode-uri-component';
import Establish from '@type/Establish';

type Props = {
    establishData: any,
    onBankSelected: (bankSelected: string) => void | React.ReactNode
};

const Widget = ({ establishData, onBankSelected }: Props): React.ReactNode => {
    const [componentToRender, setComponentToRender] = useState<React.ReactNode>(null);
    const [widgetUrl, setWidgetUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchWidgetUrl = async () => {
            const url = await getWidgetUrl(establishData);
            setWidgetUrl(url);
        };
        fetchWidgetUrl();
        
    }, [establishData]);

    const getBankSelectedMessage = (url: string, onBankSelected: (bankSelected: string, establishData: Establish) => void | React.ReactNode): boolean => {
        setComponentToRender(null);

        if (url.includes('msg://push?')) {
            let params = url.split('|')
            if (params.length > 1 && params[0].includes('PayWithMyBank.createTransaction')) {
                const component = onBankSelected(params[1], establishData);
                const isReactElement = React.isValidElement(component);
    
                establishData.widgetLoaded = true;

                if(isReactElement){
                    setComponentToRender(component, establishData);
                } else {                    
                    onBankSelected(params[1], establishData)
                }
            }
            return false;
        }
        return true;
    };

    const onShouldStartLoadWithRequest = (navState: any): boolean => {
        let decodeUrl = decodeUriComponent(navState.url)
        return getBankSelectedMessage(decodeUrl, onBankSelected)
    }

    if (!widgetUrl) {
        return null;
    }

    return <>
        <WebView
            javaScriptEnabled={true}
            onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
            originWhitelist={['*']}
            source={{ uri: widgetUrl }}
            startInLoadingState={true}
        />
        {componentToRender}
    </>;
};

export default Widget;