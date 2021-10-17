import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const CustomEditComponent = (props) => {
    return(
        <Form>
            <Form.Group className="mb-3" controlId="formCustomIssuer">
            <Form.Label>Custom Issuer</Form.Label>
            <Form.Control type="text" 
                placeholder = "Enter Address" 
                onChange = {props.onInputCustomIssuerValue}
                value = {props.customIssuerValue}
            />
            <Form.Text className="text-muted">
                Enter only r-Address
            </Form.Text>
            </Form.Group>

            <Button 
                variant = "outline-dark" 
                onClick = {props.onClickListTokens}
                disabled = {props.customIssuerValue ? false : true}
            >
                List Tokens
            </Button>
            </Form>
    )
}

export default CustomEditComponent;