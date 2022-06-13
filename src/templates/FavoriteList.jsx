import React, {useCallback} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getFavoriteProducts} from "../reducks/users/selectors";
import List from "@material-ui/core/List";
import {makeStyles} from "@material-ui/core/styles";
import {FavoriteListItem} from "../components/products";
import {push} from "connected-react-router"

const useStyles = makeStyles((theme) => ({
    root: {
        margin: '0 auto',
        maxWidth: 512,
        width: '100%'
    },
}));

const FavoriteList = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const selector = useSelector(state => state);
    const productsInFavorite = getFavoriteProducts(selector);

    return (
        <section className="c-section-wrapin">
            <h2 className="u-text__headline">お気に入り</h2>
            <List className={classes.root}>
                {productsInFavorite.length > 0 && (
                    productsInFavorite.map(product => <FavoriteListItem product={product} key={product.favoriteId} />)
                )}
            </List>
            <div className="module-spacer--medium" />
        </section>
    );
};

export default FavoriteList;