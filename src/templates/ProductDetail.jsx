import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {db,FirebaseTimestamp } from '../firebase';
import {makeStyles} from '@material-ui/core/styles';
import {ImageSwiper, SizeTable} from "../components/products";
import {addProductToCart} from "../reducks/users/operations";
import {addProductToFavorite, fetchFavoriteProducts} from "../reducks/users/operations";
import {returnCodeToBr} from "../function/common";

    // themeは全体のデザイン。スマホ画面smでは文字は下に表示。スマホは上下がスマホによって様々なのでautoに。
    // themeを使うときは大元のindex.jsにあるthemeProviderでラッピングする必要がある
const useStyles = makeStyles((theme) => ({
    sliderBox: {
        [theme.breakpoints.down('sm')]: {
            margin: '0 auto 24px auto',
            height: 320,
            width: 320
        },
        [theme.breakpoints.up('sm')]: {
            margin: '0 auto',
            height: 400,
            width: 400
        }
    },
    detail: {
        textAlign: 'left',
        [theme.breakpoints.down('sm')]: {
            margin: '0 auto 16px auto',
            height: 320,
            width: 320
        },
        [theme.breakpoints.up('sm')]: {
            margin: '0 auto',
            height: 'auto',
            width: 400
        }
    },
    price: {
        fontSize: 36
    }
}));

const ProductDetail = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const selector = useSelector((state) => state);        // useSelectorはstateの取得
    const path = selector.router.location.pathname;
    const id = path.split('/product/')[1];

    const [product, setProduct] = useState(null);

    useEffect(() => {
        db.collection('products').doc(id).get()
            .then(doc => {
                const data = doc.data();
                setProduct(data)
            })
    },[]);

        // 商品をカートに追加するとバッチが表示される機能を作る。子コンポのSizeTableに渡す必要があるのでuseCallbackで関数をメモ化する
        // addProductをFluxフローで循環処理。DB設計的にカート内情報はuserのサブフィールドにあった方が便利なのでuserのoperationsに入れる。
    const addProduct = useCallback((selectedSize) => {
        const timestamp = FirebaseTimestamp.now();
        dispatch(addProductToCart({                          //operation function
            added_at: timestamp,
            description: product.description,
            images: product.images,
            name: product.name,
            price: product.price,
            productId: product.id,
            quantity: 1,
            size: selectedSize
        }))
    },[product]);

    const addFavorite = useCallback((selectedSize) => {
        const timestamp = FirebaseTimestamp.now();
        dispatch(addProductToFavorite({
            added_at: timestamp,
            images: product.images,
            name: product.name,
            price: product.price,
            productId: product.id,
            size: selectedSize
        }))
        dispatch(fetchFavoriteProducts());
    },[product, dispatch]);

    return (
        <section className="c-section-wrapin">
            {product && (
                <div className="p-grid__row">
                    <div className={classes.sliderBox}>
                        <ImageSwiper images={product.images} />
                    </div>
                    <div className={classes.detail}>
                        <h2 className="u-text__headline">{product.name}</h2>
                        <p className={classes.price}>￥{product.price.toLocaleString()}</p>
                        <div className="module-spacer--small" />
                        <SizeTable addProduct={addProduct} addFovorite={addFavorite} product={product} sizes={product.sizes}/>
                        <div className="module-spacer--small" />
                        <p>{returnCodeToBr(product.description)}</p>
                    </div>
                </div>
            )}
        </section>
    )
};

export default ProductDetail;