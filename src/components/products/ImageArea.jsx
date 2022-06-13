import React, {useCallback} from 'react';
import IconButton from "@material-ui/core/IconButton";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import {makeStyles} from "@material-ui/core/styles";
import {storage} from "../../firebase/index";
import {ImagePreview} from "./index";

// iconのフィールドが楕円形なのを修正する。
const useStyles = makeStyles( {
    icon: {
        marginRight:88,
        height: 48,
        width: 48
    }
})

// ProductEditの画像アップロード機能
const ImageArea = (props) => {
    const classes = useStyles();
    const images = props.images;

    const deleteImage = useCallback(async (id) => {
        const ret = window.confirm('この画像を削除しますか？')
        if (!ret) {
            return false
        } else {
                // idと一致しない画像だけを抽出し、その配列をnewImagesとして更新する。
            const newImages = images.filter(image => image.id !== id)
            props.setImages(newImages);
            return storage.ref('images').child(id).delete()
        }
    }, [images]);

    const uploadImage = useCallback((e) => {
            // アップロードされた画像を取得
        const file = e.target.files;
            // 取得した画像はCloud Storageではそのままアップロードできないので一度Blobとい
            // うオブジェクトに変える必要がある。Blobの第一引数にfire、第二引数にはtype
            // を渡して、変数blobにする。
        let blob = new Blob(file, { type: "image/jpeg" });

            // Generate random 16 digits strings
            // ファイル名をランダムな文字列に表示したい。もし同じファイル名がアップロードされて
            // しまったら競合が起きてめんどくさいバグが発生する。Sは生成するときに使う文字。
        const S="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const N=16;
            // Array.fromを使って16桁の文字列をランダム生成。最終的に.joinというのにすることで
            // 16個の文字列に連結する。
        const fileName = Array.from(crypto.getRandomValues(new Uint32Array(N)))
                            .map((n)=>S[n%S.length]).join('');
            // CloudStorageのメソッドを使う。
            //storageはfirebaseのindex.jsでエクスポートした定数。
            // refの中身はpathで、アップロードはその中に保存される。
            // .childを指定するとファイル名を指定できるようになる。
            // アップロードするときはputメソッドを使う。渡すのはblobオブジェクト
        const uploadRef = storage.ref('images').child(fileName);
        const uploadTask = uploadRef.put(blob);

            // .thenとするとアップロードが終わった後に実行する処理を記述できる。
            //  ダウンロードしたURLをイメージタグのソース属性に渡してやると画像を表示できる。
            // imagesというローカルのstateを用意してあるので、そのstateを更新する形。
        uploadTask.then(() => {
                    // Handle successful uploads on complete
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                const newImage = {id: fileName, path: downloadURL};
                    // useStateのset関数。prevStateとすると更新前のstateを使えるテク！
                    // こうすると過去の画像データを消さずに追加できる。
                props.setImages((prevState => [...prevState, newImage]))
                    // useCallbackを使うことでrenderする度にsetImagesが変更された時以外は無駄に再生成されないようにする。
                    // dispatch(hideLoadingAction())
            });
        })
    },[props.setImage])

    return (
        <div>
            <div className="p-grid__list-images">
                {images.length > 0 && (
                    images.map(image =>
                        <ImagePreview delete={deleteImage} id={image.id} path={image.path}
                        key={image.id} />)
                )}
            </div>

            <div className="u-text-right">
                <span>商品画像を登録する</span>
                <IconButton className={classes.icon}>
                    <label>
                        <AddPhotoAlternateIcon />
                        <input
                            className="u-display-none" type="file" id="image"
                            onChange={e => uploadImage(e)}
                        />
                    </label>
                </IconButton>
            </div>
        </div>
    )
}

export default ImageArea;