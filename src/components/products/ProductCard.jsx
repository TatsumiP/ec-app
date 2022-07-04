import React,{useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import NoImage from '../../assets/img/src/no_image.png';
import {push} from 'connected-react-router';
import {useDispatch} from "react-redux";
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import M0reVertIcon from '@material-ui/icons/MoreVert';
import {deleteProduct} from "../../reducks/products/operations";

    // themeは全体のデザイン？ calcはスマホ表示で画像二列で表示させたいので50%?
    // Material-uiのブレイクポイントはmakeStyles()を使って定義できる。引数themeを受け取るbreakpointsは設定できる。詳細は公式ドキュで
const useStyles = makeStyles((theme) => ({
    root: {
        [theme.breakpoints.down('sm')]: {
            margin: 8,
            width: 'calc(50% - 16px)'
        },
        [theme.breakpoints.up('sm')]: {
            margin: 16,
            width: 'calc(33.3333% - 32px)'
        }
    },
    content: {
        display: 'flex',
        padding: '16px 8px',
        textAlign: 'left',
        '&:last-child': {
            paddingBottom: 16
        }
    },
    media: {
        height: 0,
        paddingTop: '100%'
    },
    price: {
        color: theme.palette.secondary.main,
        fontSize: 16
    }
}));
    // Typographyとは活版印刷所。material-uiのテーマとそのセット。
    // material-ui/cardにSNSっぽいいいねや共有リンクがついているカードコンポが用意されている。
const ProductCard = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();

        // Menuコンポーネント。メニュー開閉のstateとstateを変更する関数たち
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget)
    };

    const handleClose = () => {
        setAnchorEl(null)
    };

        //  画像がない商品でも画像を表示することができる
    const images = (props.images.length > 0) ? props.images : [NoImage];
        // toLocalStringは3桁ごとに区切る
    const price = props.price.toLocaleString();

    return (
        <Card className={classes.root}>
            <CardMedia
                className={classes.media}
                image={images[0].path}
                title=""
                onClick={() => dispatch(push('/product/edit/' + props.id))}
            />
            <CardContent className={classes.content}>
                <div onClick={() => dispatch(push('/product/edit/' + props.id))}>
                    <Typography color="textSecondary" component="p">
                        {props.name}
                    </Typography>
                    <Typography className={classes.price} component="p">
                        ¥{price}
                    </Typography>
                </div>
                <IconButton onClick={handleClick}>
                    <M0reVertIcon />
                </IconButton>
                <Menu
                    aonchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem
                        onClick={() => {
                            dispatch(push('/product/edit/' + props.id))
                            handleClose()
                        }}
                    >
                        編集する
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            dispatch(deleteProduct(props.id));
                            handleClose()
                        }}
                    >
                        削除する
                    </MenuItem>
                </Menu>
            </CardContent>
        </Card>
    )
};

export default ProductCard;