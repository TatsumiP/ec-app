import React, {useCallback, useEffect, useState} from 'react'
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import {makeStyles} from "@material-ui/core/styles";
import {TextInput} from "../UIkit";

const useStyles = makeStyles( {
    checkIcon: {
        float: 'right'
    },
    iconCell: {
        padding: 0,
        height: 48,
        width: 48
    }
});

// productEditページのサイズと個数
const SetSizeArea = (props) => {
    const classes = useStyles();

    const [index, setIndex] = useState(0),
          [size, setSize] = useState(""),
          [quantity, setQuantity] = useState(0);

        // useCallbackでラッピング。onChangeで呼び出されたinputSizeでsizeが入力される
    const inputSize = useCallback((e) => {
        setSize(e.target.value)
    }, [setSize]);

    const inputQuantity = useCallback((e) => {
        setQuantity(e.target.value)
    }, [setQuantity]);

    const addSize = (index, size, quantity) => {
        if (size === "" || quantity === "") {
            // Required input is blank
            return false
        } else {
                // 新規のときのみindex===props.sizes.length
            if (index === props.sizes.length) {
                props.setSizes(prevState => [...prevState, {size: size, quantity: quantity}])
                setIndex(index + 1)
                setSize("")
                setQuantity(0)
            } else {
                const newSizes = props.sizes
                newSizes[index] = {size: size, quantity: quantity}
                props.setSizes(newSizes)
                setIndex(newSizes.length)
                setSize("")
                setQuantity(0)
            }
        }
    }

        // editIconを押すとeditSizeが走る。checkCircleを押すとaddSizeが走り、更新の条件分岐でsetSizeが更新される。
    const editSize = (index, size, quantity) => {
        setIndex(index)
        setSize(size)
        setQuantity(quantity)
    };
        // 消したいものを抜いた形で更新
    const deleteSize = (deleteIndex) => {
        const newSizes = props.sizes.filter((item, index) => index !== deleteIndex);
        props.setSizes(newSizes)
    };

        // 最初からsetindexが入ってるときにその値を使ってね、という関数
    useEffect(() => {
        setIndex(props.sizes.length)
    },[props.sizes.length]);

    return (
        <div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>サイズ</TableCell>
                            <TableCell>数量</TableCell>
                            <TableCell className={classes.iconCell} />
                            <TableCell className={classes.iconCell} />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.sizes.length > 0 && (
                            props.sizes.map((item, index) => (
                                <TableRow key={item.size}>
                                    <TableCell>{item.size}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>
                                        <IconButton className={classes.iconCell} onClick={() => editSize(index, item.size, item.quantity)}>
                                            <EditIcon />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton className={classes.iconCell} onClick={() => deleteSize(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <div>
                    <TextInput
                        fullWidth={false} label={"サイズ"} multiline={false} required={true}
                        onChange={inputSize} rows={1} value={size} type={"text"}
                    />
                    <TextInput
                        fullWidth={false} label={"数量"} multiline={false} required={true}
                        onChange={inputQuantity} rows={1} value={quantity} type={"number"}
                    />
                </div>
                <IconButton className={classes.checkIcon} onClick={() => addSize(index, size, quantity)}>
                    <CheckCircleIcon />
                </IconButton>
            </TableContainer>
        </div>
    );
};

export default SetSizeArea;