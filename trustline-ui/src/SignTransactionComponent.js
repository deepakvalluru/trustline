import Button from "react-bootstrap/Button";

const SignTransactionComponent = (props) => {
    
    return(
        <Button variant="outline-dark" size="sm"
            onClick={!props.isLoading ? () => props.signTranscation(props.selectedCurrency) : null}
            disabled={!(props.selectedCurrency) || props.isLoading}>
            {props.isLoading ? 'Signing…' : 'Sign Transaction'}
          </Button>
    )
}

export default SignTransactionComponent;