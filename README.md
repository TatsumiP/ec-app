<h1 style="text-align:center;">
オリジナルスタンプ・イギリス雑貨専用のECサイト
</h1>

![profile1.png](./src/assets/img/src/profile1.png)

## アプリケーションの概要
開発者の妻が個人制作しているスタンプを売るECサイト。
アプリのコンセプトは「日英、まだ見ぬ可愛いを見つける、つながる」です。
現在は妻の手作りスタンプ・雑貨のみ販売するECサイトです。
いずれは妻が数年のイギリス滞在時に育てたイギリスの小物作家との人脈を使って、イギリスの
可愛い個人制作雑貨を日本で手軽に買える、または日本の伝統的な絵柄やモチーフのスタンプ・雑貨をイギリス人
に買ってもらうECサイトに成長させたいと考えています。

## App URL
[http://pompomkingdom.conohawing.com/](http://pompomkingdom.conohawing.com/)

【管理者用アカウント】
  - メールアドレス：mochimochi2@gmail.com  
  - パスワード:mochimochi2　

## 主な利用方法

## 使用技術
 - ### フロントエンド
   - React  
   - react-router  
   - connected-react-router 
   - stripe-js
   - history  
   - html-react-parser  
   - react-hot-toast 
   - swiper
   - Redux
   - HTML/CSS/Sass  
   - Material UI(MUI)
　
 - ### バックエンド
   - Firebase  
   - Cloud Firestore 
   - Firebase Authentication
   - Storage 
   - Stripe API
   - SendGrid API
  
## 機能一覧
  - #### サインイン/サインアップ
    - Firebase Authenticationによってメール/パスワード認証を行なっています。 
    - sendPasswordResetEmailメソッドを用いて、パスワードを忘れた時でも新しいパスワードにすぐ変更できるようにしています。      
  - #### 商品一覧ページ
    - 販売中の商品が並んだページ。 メンズ/レディース、トップス・アウターなどのカテゴリごとの絞り込み機能、並び替え機能(更新順、価格の高い順、低い順)、キーワード検索機能をつけました。  
  - #### 商品詳細ページ 
    - 商品の詳細を載せたページ。 商品画像の表示にはreact-id-swiperを使用し、複数の画像をスライダーで閲覧できるようになっています。 サイズを選択して、ショッピングカートへの追加やお気に入りへの追加を行うことができます。
    
  - #### ショッピングカート/購入機能  
    - 商品詳細でショッピングカートへ追加した商品をリストで確認、リストからの削除、購入の機能があります。 
    - 購入の処理時には、Firestoreのトランザクションを使用しており、処理が失敗するとロールバック(全ての購入処理をリセット)されるようになっています。これにより商品の在庫や購入履歴等でのデータの乖離を阻止し、よきせぬトラブルに備えています。  
    
  - #### 管理者機能  
    - 管理者でログインした時に、商品の登録、編集、削除が行えます。商品の商品画像追加時には、FirebaseのStorageに画像がアップロードされます。 
  - #### プロフィールページ  
  - #### レスポンシブ対応  
  - #### 通知バナーでの通知   　


