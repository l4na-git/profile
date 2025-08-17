const { src, dest, series, parallel, watch } = require('gulp');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const clean = require('gulp-clean');
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const through2 = require('through2');
const fs = require('fs');
const path = require('path');

// パス変換ユーティリティ
const pathUtils = {
  // GitHub Pages用のナビゲーションパス変換
  convertNavPaths: (template) => {
    return template
      .replace(/href="\/"/g, 'href="./index.html"')
      .replace(/href="\/about"/g, 'href="./about.html"')
      .replace(/href="\/product"/g, 'href="./product.html"');
  },
  
  // 画像パス変換
  convertImagePaths: (template) => {
    return template
      .replace(/src="\.\.\/images\//g, 'src="./images/')
      .replace(/href="\.\.\/images\//g, 'href="./images/');
  }
};

// テンプレート読み込みとパス変換
function loadAndProcessTemplates() {
  const layoutPath = path.join(__dirname, 'originals/layouts/layout.ejs');
  const headerPath = path.join(__dirname, 'originals/layouts/header.ejs');
  const footerPath = path.join(__dirname, 'originals/layouts/footer.ejs');
  
  let layoutTemplate = fs.readFileSync(layoutPath, 'utf8');
  let headerTemplate = fs.readFileSync(headerPath, 'utf8');
  let footerTemplate = fs.readFileSync(footerPath, 'utf8');
  
  // ヘッダーの変換
  headerTemplate = pathUtils.convertNavPaths(headerTemplate);
  
  // フッターの変換
  footerTemplate = pathUtils.convertImagePaths(footerTemplate);
  
  // レイアウトにヘッダーとフッターを組み込み
  layoutTemplate = layoutTemplate
    .replace(/<%- include\('header'\) %>/, headerTemplate)
    .replace(/<%- include\('footer'\) %>/, footerTemplate);
  
  // レイアウトの画像パス変換
  layoutTemplate = pathUtils.convertImagePaths(layoutTemplate);
  
  return layoutTemplate;
}

// ページコンテンツの変換
function processPageContent(content) {
  return pathUtils.convertImagePaths(content)
    .replace(/href="\/about"/g, 'href="./about.html"')
    .replace(/href="\/product"/g, 'href="./product.html"');
}

// EJS レンダリング共通処理
function renderEjsPage(pageContent, isHome = false) {
  const ejs = require('ejs');
  const layoutTemplate = loadAndProcessTemplates();
  const modifiedPageContent = processPageContent(pageContent);
  
  return ejs.render(layoutTemplate, {
    content: modifiedPageContent,
    isHome: isHome
  });
}

// docsフォルダを削除
function cleanDocs() {
  return src('docs', { allowEmpty: true, read: false }).pipe(clean());
}

// EJSをHTMLに変換（layout.ejsを使用）
function compileEjs() {
  return src(['originals/pages/*.ejs', '!originals/pages/home.ejs'])
    .pipe(through2.obj(function(file, enc, cb) {
      const originalFileName = path.basename(file.path, '.ejs');
      const pageContent = file.contents.toString();
      
      const renderedHtml = renderEjsPage(pageContent, false);
      file.contents = Buffer.from(renderedHtml);
      file.path = path.join(path.dirname(file.path), originalFileName + '.html');
      
      cb(null, file);
    }))
    .pipe(htmlmin({ 
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true
    }))
    .pipe(dest('docs'));
}

// index.htmlとして作成（ホーム用、layout.ejsを使用）
function compileHome() {
  return src('originals/pages/home.ejs')
    .pipe(through2.obj(function(file, enc, cb) {
      const pageContent = file.contents.toString();
      
      const renderedHtml = renderEjsPage(pageContent, true);
      file.contents = Buffer.from(renderedHtml);
      file.path = path.join(path.dirname(file.path), 'index.html');
      
      cb(null, file);
    }))
    .pipe(htmlmin({ 
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true
    }))
    .pipe(dest('docs'));
}

// CSSをコピー＆圧縮
function styles() {
  return src('originals/output.css')
    .pipe(cleanCSS({
      level: 2,
      rebase: false
    }))
    .pipe(dest('docs'));
}

// 画像をコピー（最適化は後で追加）
function images() {
  return src('originals/images/**/*')
    .pipe(dest('docs/images'));
}

// その他のファイルをコピー
function copyFiles() {
  return src(['CNAME', 'originals/favicon.*'])
    .pipe(dest('docs'));
}

// ファイル監視
function watchFiles() {
  watch('originals/**/*.ejs', series(compileEjs, compileHome));
  watch('originals/**/*.css', styles);
  watch('originals/images/**/*', images);
}

// ビルドタスク
const build = series(
  cleanDocs,
  parallel(compileEjs, compileHome, styles, images, copyFiles)
);

// 開発タスク
const dev = series(build, watchFiles);

exports.build = build;
exports.dev = dev;
exports.default = build;