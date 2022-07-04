import {React, useCallback } from 'react'
import Table from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import {makeStyles} from "@material-ui/core/styles";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from '@material-ui/icons/Favorite';
import { useDispatch, useSelector } from 'react-redux';
import { getFavoriteProducts, getIsSignedIn } from '../../reducks/users/selectors';
import { fetchFavoriteProducts } from '../../reducks/users/operations';
import { useEffect } from 'react';

const useStyles = makeStyles( {
    iconCell: {
        padding: 0,
        height: 48,
        width: 48
    }
});

const SizeTable = (props) => {
    const {addProduct, addFavorite, product, sizes} = props;

    const classes = useStyles();
    const dispatch = useDispatch();
    const selector = useSelector();
    const isSignedIn = getIsSignedIn(selector);
    const favoriteProducts = getFavoriteProducts(selector);

    // 商品がお気にいりに登録されているかどうかを判定
    const isFavorite = useCallback((size) => {
        return favoriteProducts.some((favorite) =>
            favorite.productId === product.id && favorite.size === size
        )
    },[favoriteProducts, product]);

    // お気に入りリストをデータベースより取得
    useEffect(() => {
        dispatch(fetchFavoriteProducts())
    },[dispatch]);


    return (
        <div>
            <TableContainer>
                <Table aria-label="simple table">
                    <TableBody>
                        {sizes.length > 0 && (
                            sizes.map(size => (
                                <TableRow key={size.size}>
                                    <TableCell component="th" scope="row">
                                        {size.size}
                                    </TableCell>
                                    <TableCell>
                                        残り{size.quantity}点
                                    </TableCell>
                                    <TableCell className={classes.iconCell}>
                                        {size.quantity > 0 ? (
                                            <IconButton
                                                onClick={() => props.addProduct(size.size)}
                                            >  {/*ボタンを押すと商品を追加 */}
                                                <ShoppingCartIcon />
                                            </IconButton>
                                        ) : (
                                            <div>売切</div>
                                        )}
                                    </TableCell>
                                    <TableCell className={classes.iconCell}>
                                        {isFavorite(size.size) ? (
                                            <iconButton onClick={() => props.addFavorite(size.size)}>
                                                <FavoriteIcon color='secondary' />
                                            </iconButton>
                                        ) : (
                                            <IconButton onClick={() => {addFavorite(size.size)}}>
                                                <FavoriteBorderIcon />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default SizeTable;