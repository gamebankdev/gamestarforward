const  Router = require('koa-router');
const router=new Router()
const gamebank = require('gamebank');
gamebank.api.setOptions({ url: 'http://192.168.1.88:8090' })
gamebank.config.set('address_prefix','TST');
gamebank.config.set('chain_id','18dcf0a285365fc58b71f18b3d3fec954aa0c141c44e4e5cb4cf777b9eab274e');
console.log(gamebank.broadcast)
router.post('/API/:attribute/:method',async ctx=>{
  await new Promise((resolve,reject)=>{
        const {attribute,method}=ctx.params
        const params = JSON.parse(ctx.request.body)
        // const params = ctx.request.body
        params.push(function(err,result){
            if(err){
                reject(err)
            }else{
                resolve(result)
            }
        })
        gamebank[attribute][method].apply(null,params)
    })
    .then(res=>{
        ctx.body=res
        ctx.status=200
    })
    .catch(err=>{
        console.log(err)
        ctx.body=err
        ctx.status=400
    })
})

module.exports=router
