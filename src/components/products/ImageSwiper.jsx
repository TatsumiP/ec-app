import React from 'react';
import Swiper from "react-id-swiper";
import NoImage from "../../assets/img/src/no_image.png";
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'

    // material-uiのswiperをnpmでインストール後にパラメーター設定を行う
    // info: swiper module changes. importRef left.

    const ImageSwiper = (props) => {
    const [params] = React.useState( {
        pagination:{
            el: '.swiper-pagination',           //
            type: 'bullets',
            clickable: true,
            dynamicBullets: true                // 画像下の点々がBullets。表示しているBulletsを大きくするかどうか
        },
        // navigation: {
        //     nextEl: 'swiper-button-next',
        //     prevEl: 'swiper-button-prev'
        // },
        loop: true,
        spaceBetween: 30
    })

    const images = props.images

    return (
        <Swiper {...params}>
            {images.length === 0 ? (
                <div className="p-media__thumb">
                    <img src={NoImage} alt="no image"/>
                </div>
            ) : (
                images.map(image => (
                    <div className="p-media  thumb" key={image.id}>
                        <img src={image.path} alt="商品画像"/>
                    </div>
                ))
            )}
        </Swiper>
    );
};

export default ImageSwiper;