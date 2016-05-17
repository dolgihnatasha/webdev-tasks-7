var path = require('path');
var webpack = require('webpack');
var config = {
    context: path.join(__dirname, 'src'),
    entry: './index',
    output: {
        path: path.join(__dirname, '.'),
        publicPath: '/'
    }
};
var compiler = webpack(config);
compiler.run(function (err, stats) {
    console.log('ok');
});