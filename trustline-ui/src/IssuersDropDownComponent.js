import Dropdown from 'react-bootstrap/Dropdown';

const IssuersDropDownComponent = (props) => {

    return(
        <Dropdown>
        <Dropdown.Toggle 
            size="sm" 
            variant="light" 
            id="issuers-dropdown">
            {props.selectedIssuer && props.selectedIssuer.length > 0 
                ? props.selectedIssuer : "SELECT ISSUER"}
        </Dropdown.Toggle>

        <Dropdown.Menu>
            {props.issuers.map((issuer, index) =>(
            <Dropdown.Item 
                key={issuer+index}
                active={props.selectedIssuer===issuer}
                onClick={() => props.OnSelectIssuerDropDown(issuer)}>
                {issuer}
            </Dropdown.Item>  
            ))}
        </Dropdown.Menu>
        </Dropdown>
    )
}

export default IssuersDropDownComponent;