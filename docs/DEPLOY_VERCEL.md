# Vercel でのデプロイ方法

このプロジェクト（Vite + React）を Vercel にデプロイする手順です。

---

## 前提

- GitHub にコードが push 済みであること
- GitHub アカウントがあること

---

## 手順

### 1. Vercel にアクセス

1. ブラウザで **https://vercel.com** を開く
2. **Sign Up** または **Log In** をクリック
3. **Continue with GitHub** を選び、GitHub でログインする

### 2. リポジトリをインポート

1. ログイン後、**Add New…** → **Project** をクリック
2. **Import Git Repository** の一覧に、あなたの GitHub リポジトリが出る
3. デプロイしたいリポジトリ（例: `dog-cat-medicine-guide`）の **Import** をクリック

### 3. 設定（そのままで OK なことが多い）

次の画面で設定を確認します。**多くの場合はそのままで大丈夫**です。

| 項目 | 推奨値 | 説明 |
|------|--------|------|
| **Framework Preset** | Vite | 自動検出されているはず |
| **Root Directory** | （空のまま） | リポジトリのルートがこのプロジェクトならそのまま |
| **Build Command** | `npm run build` | そのまま |
| **Output Directory** | `dist` | Vite のビルド先。そのまま |
| **Install Command** | `npm install` | そのまま |

**Deploy** をクリックする。

### 4. デプロイ完了まで待つ

- ビルドログが流れ、1〜2 分ほどで完了する
- 完了すると **Congratulations!** と表示され、**Visit** のリンクから本番 URL に飛べる（例: `https://〇〇.vercel.app`）

### 5. あとからコードを更新したとき

- ローカルで `git add` → `git commit` → `git push` する
- Vercel が GitHub の変更を検知して、**自動で再デプロイ**する
- 手動でデプロイし直す必要は基本的にない

---

## もう一度プッシュして再デプロイする方法

コードを直したあと、**もう一度 GitHub にプッシュして Vercel で再デプロイ**する手順です。

### 方法 A：通常の流れ（プッシュで自動再デプロイ）

1. **ターミナル（PowerShell など）を開く**
   - プロジェクトのフォルダ（`c:\Users\tbr_0\Desktop\src` など）にいることを確認する。

2. **変更をステージングする**
   ```powershell
   git add .
   ```
   - すべての変更をコミット対象にする場合。特定のファイルだけにする場合は `git add ファイル名` で指定する。

3. **コミットする**
   ```powershell
   git commit -m "ビルドエラー修正（インポート・依存関係など）"
   ```
   - `-m` の後のメッセージは、何を直したか分かるように自由に書いてよい。

4. **GitHub にプッシュする**
   ```powershell
   git push origin main
   ```
   - ブランチ名が `main` でない場合は、その名前に変える（例: `master` なら `git push origin master`）。

5. **Vercel の自動再デプロイを待つ**
   - プッシュが成功すると、Vercel が変更を検知して **自動で新しいデプロイ** を開始する。
   - Vercel のダッシュボード（https://vercel.com/dashboard）を開くと、**Deployments** に新しいデプロイが並ぶ。
   - ステータスが **Building** → **Ready** になれば完了。**Visit** からサイトを開いて確認する。

---

### 方法 B：Vercel 上で手動で再デプロイする

「同じコードのまま、もう一度ビルドだけやり直したい」ときは、Vercel 上で手動再デプロイできます。

1. **Vercel にログインする**
   - https://vercel.com を開き、GitHub でログインする。

2. **プロジェクトを開く**
   - ダッシュボードで、対象のプロジェクト（例: `dog-cat-medicine-guide`）をクリックする。

3. **Deployments タブを開く**
   - 画面上部の **Deployments** をクリックする。

4. **再デプロイを実行する**
   - 一覧のうち、**再デプロイしたいデプロイ**（通常は一番上）の右側の **︙（縦三点）** をクリックする。
   - **Redeploy** を選ぶ。
   - 確認ダイアログで **Redeploy** を再度クリックする。

5. **完了を待つ**
   - 新しいデプロイが始まり、**Building** → **Ready** になれば完了。**Visit** でサイトを確認する。

※ 手動の **Redeploy** は「いま GitHub にある最新のコミット」をそのまま再ビルドするだけです。ローカルの変更を反映したい場合は、必ず **方法 A** で `git push` してから、自動デプロイを待つか、そのあとで手動 Redeploy してください。

---

## うまくいかないとき

### ビルドエラーになる

- Vercel のプロジェクト画面 → **Deployments** → 失敗したデプロイをクリック → **Building** のログを開く
- **エラー文**を確認する（例: `npm run build` が失敗、TypeScript エラーなど）
- ローカルで `npm run build` を実行し、同じエラーが出ないか確認する

### 404 や真っ白な画面になる

- **Output Directory** が `dist` になっているか確認する
- ルートが `src` など別フォルダの場合は、**Root Directory** にそのパスを指定する（このプロジェクトはルートがリポジトリ直下なら不要）

### 環境変数を使う場合

- プロジェクト画面 → **Settings** → **Environment Variables**
- 名前と値を追加し、**Save** する
- 再デプロイすると反映される

---

## まとめ

1. **vercel.com** に GitHub でログイン
2. **Add New → Project** でリポジトリを **Import**
3. 設定はそのまま **Deploy**
4. 表示された **Visit** の URL が本番サイト

以降は `git push` するたびに自動で再デプロイされます。
