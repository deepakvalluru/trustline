import ListGroup from 'react-bootstrap/ListGroup';
import React from 'react';

const CurrencyListComponent = (props) => {
    
    return (
        
        Object.keys(props.currencies).map((currency, index) =>(
        <ListGroup size="sm">
            <ListGroup.Item 
                key={currency+index}
                active={props.selectedCurrency.currency===currency}
                onClick={() => props.onSelectCurrency(props.currencies[currency])}>
                    <img src={props.currencies[currency].avatar} 
                    alt=""
                    style={{display:'inline', margin:'6px'}} 
                    width="20" height="20"/>
                    {currency} - {props.currencies[currency].name}
            </ListGroup.Item>
        </ListGroup>
        ))
        
    )
}

export default CurrencyListComponent;