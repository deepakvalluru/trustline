import React, { useState, useEffect } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import IssuersDropDownComponent from './IssuersDropDownComponent';
import CurrencyListComponent from './CurrencyListComponent';
import SignTransactionComponent from './SignTransactionComponent';
import CustomEditComponent from './CustomEditComponent';

const TabsComponent = () => {
    const [tab, setTab] = useState('commonIssuer');
    const [issuers, setIssuers] = useState([]);
    const [selectedIssuer, setSelectedIssuer] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [customIssuerValue, setCustomIssuerValue] = useState([]);
    
    useEffect(() => {
        fetch("http://localhost:3000/api/issuers")
          .then(res => res.json())
          .then(
            (result) => {
                setIssuers(result);
                setSelectedCurrency("");
            }
          )
      }, []);

    const OnSelectIssuerDropDown = (selectedIssuer) => {
        console.log("selectedIssuer: "+ selectedIssuer);
        setSelectedIssuer(selectedIssuer);
        // console
        fetch(`http://localhost:3000/api/issuers/${selectedIssuer}/currencies`)
            .then(res => res.json())
            .then(
                (result) => {
                    setCurrencies(result);
                    // clear selected currency after refreshing the issuer.
                    setSelectedCurrency("");
                    console.log(result);
                }
            )
    }

    const onSelectCurrency = (selectedCurrency) => {
        console.log("selectedCurrency: " + JSON.stringify(selectedCurrency));
        setSelectedCurrency(selectedCurrency);
    }

    const signTranscation = (selectedCurrency) => {
        setLoading(true);
        console.log("Calling Sign transaction with currency", selectedCurrency);
        fetch(`http://localhost:3000/api/signTransaction`, {
          method: "post",
          body: JSON.stringify(selectedCurrency),
          headers: {'content-type': 'application/json', 'Accept': 'application/json'},
        //   mode: 'no-cors'
        })
        .then(result => result.json())
        .then((result) => {
            console.log("called Sign Transaction! ", result);
            console.log("Next link ", result.next.always);
            setLoading(false);
            window.location.href = result.refs.qr_png;
        })
        .catch(ex => {
          console.log("Received an exception when signing transaction: " + ex);
        })
    }

    const onInputCustomIssuerValue = ({target:{value}}) => setCustomIssuerValue(value);

    const onClickListTokens = () => {
        console.log("Custom Issuer", customIssuerValue);
        fetch(`http://localhost:3000/api/obligations/${customIssuerValue}`)
            .then(res => res.json())
            .then(
                (result) => {
                    setCurrencies(result);
                    // clear selected currency after refreshing the issuer.
                    setSelectedCurrency("");
                    console.log(result);
                }
            )
    }

    const onClickTab = (k) => {
        setCurrencies([]);
        setSelectedIssuer("");
        setCustomIssuerValue("");
        setTab(k);
    }

    return (
        <>
        <Row>
            <Tabs
            id="options-tab"
            activeKey={tab}
            onSelect={(k) => onClickTab(k)}
            className="mb-3"
            >
                <Tab eventKey="commonIssuer" title="Add Currency">
                    <br/>
                    <Row>
                        <Col sm={{ span: 3}}>
                            <IssuersDropDownComponent 
                                issuers={issuers} 
                                OnSelectIssuerDropDown={OnSelectIssuerDropDown}
                                selectedIssuer={selectedIssuer}
                            />
                        </Col>

                        <Col sm={{ span: 4, offset:1}}>
                            <CurrencyListComponent 
                                currencies={currencies} 
                                onSelectCurrency={onSelectCurrency}
                                selectedCurrency={selectedCurrency}
                            />
                        </Col>
                    </Row>
                </Tab>
                <Tab eventKey="customEdit" title="Custom Edit">
                    <br/>
                    <Row>
                        <Col sm={{ span: 3}}>
                            <CustomEditComponent
                                onInputCustomIssuerValue = {onInputCustomIssuerValue}
                                onClickListTokens = {onClickListTokens}
                                customIssuerValue = {customIssuerValue}
                            />
                        </Col>

                        <Col sm={{ span: 4, offset:1}}>
                            <CurrencyListComponent 
                                currencies={currencies} 
                                onSelectCurrency={onSelectCurrency}
                                selectedCurrency={selectedCurrency}
                            />
                        </Col>
                    </Row>
                </Tab>
            </Tabs>
        </Row>

        <Row>
            <SignTransactionComponent
                isLoading = {isLoading}
                signTranscation = {signTranscation}
                selectedCurrency = {selectedCurrency}
            />
        </Row>

        </>
    );
}

export default TabsComponent;