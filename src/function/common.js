import HTMLReactParser from "html-react-parser";

export const returnCodeToBr = (text) => {
    if (text === "") {
        return text
    } else {
        return HTMLReactParser(text.replace(/\r?\n/g, '<br/>'))
    }
};
