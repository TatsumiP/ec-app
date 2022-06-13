import React from 'react'
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import {makeStyles} from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import { useDispatch } from 'react-redux';
import { removeFavorite } from '../../reducks/users/operations';

const useStyles = makeStyles((theme) => ({
    list: {
        height: 128
    },
    image: {
        objectFit: 'cover',     //  はみ出た画像を切り取ってそのまま表示するCSS
        margin:16,
        height: 96,
        width:96
    },
    text: {
        width: '100%'
    }
}));

const FavoriteListItem = (props) => {
    const { product } = props;
    const classes = useStyles();
    const dispatch = useDispatch();

    const image = props.product.images[0].path;
    const name = props.product.name;
    const price = props.product.price.toLocaleString();
    const size = props.product.size;

    // お気に入りリストから商品を排除する
    const removeFromFavorite = (id) => {
        dispatch(removeFavorite(id));
    };

        // classesというプロップスがFavoriteList.jsxでproduct変数に代入される仕様
    return (
        <div>
            <ListItem className={classes.list}>
                <ListItemAvatar>
                    <img className={classes.image} src={image} alt='商品画像' />
                </ListItemAvatar>
                <div className={classes.text}>
                    <ListItemText
                        primary={name}
                        secondary={"サイズ" + size}
                    />
                    <ListItemText
                        primary={"￥" + price}
                    />
                </div>
                <IconButton onClick={() => removeFromFavorite(product.Id)}>
                    <DeleteIcon />
                </IconButton>
            </ListItem>
            <Divider />
        </div>
    )
}

export default FavoriteListItem