import serve from 'rollup-plugin-serve';

const serveopts = {
  contentBase: ['distjs'],
  host: '0.0.0.0',
  port: 5050,
  open: true,
  allowCrossOrigin: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};

export default {
  input: 'srcjs/flex-horseshoe-card.js',
  output: {
    file: 'distjs/flex-horseshoe-card-bundle.js',
    format: 'es',
    name: 'FlexHorseshoeCard',
    sourcemap: true,
  },
  plugins: [
    serve(serveopts),
  ],
};
