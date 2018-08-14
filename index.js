const Koa = require('koa');
const app = new Koa();
const koaBody = require('koa-body');
const router=require('./Routes/API')
const cors = require('koa2-cors')

app
  .use(cors({
    origin: function (ctx) {
        return '*';
    },
    credentials: true,
    allowMethods: ['GET', 'POST'],
  }))
  .use(koaBody())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(5000);