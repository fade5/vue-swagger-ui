<template>
    <div class="container">
        <div class="row">
            <h3 >{{reportModel.title}}</h3>
            <!--<select class="custom-select" id="selectCityId">
                <option v-for="city in reportModel.cityList"
                        :selected="isEq(city.cityId)"  @change="clickCity(city.cityId)">{{city.cityName}}</option>
            </select>-->
            <el-select   placeholder="请选择" v-model="city" @change="clickCity(this)">
                <el-option v-for="(item,index) in reportModel.cityList" :key="item.cityId" :value="item.cityName" :label="item.cityName">
                </el-option>
            </el-select>
        </div>
        <div v-if="reportModel.report !=null">
            <div class="row">
                <h1 class="text-success" v-model="reportModel.report.data.city">{{reportModel.report.data.city}}</h1>
            </div>
            <div class="row">
                <p>
                    空气质量指数：<span v-model="reportModel.report.data.aqi">{{reportModel.report.data.aqi}}</span>
                </p>
            </div>
            <div class="row">
                <p>
                    当前温度：<span v-model="reportModel.report.data.wendu">{{reportModel.report.data.wendu}}</span>
                </p>
            </div>
            <div class="row">
                <p>
                    温馨提示：<span v-model="reportModel.report.data.ganmao">{{reportModel.report.data.ganmao}}</span>
                </p>
            </div>
            <div class="row">
                <div class="card border-info" >
                    <div class="card-body bg-info text-white">
                        <p class ="card-text" >日期</p>
                        <p class ="card-text" >天气类型</p>
                        <p class ="card-text">最高温度</p>
                        <p class ="card-text" >最低温度</p>
                        <p class ="card-text">风向</p>
                    </div>
                </div>
                <div class="card border-info" v-for="forecast in reportModel.report.data.forecast">
                    <div class="card-body text-info">
                        <p class ="card-text" v-model="forecast.date">{{forecast.date}}</p>
                        <p class ="card-text" v-model="forecast.type">{{forecast.type}}</p>
                        <p class ="card-text" v-model="forecast.high">{{forecast.high}}</p>
                        <p class ="card-text" v-model="forecast.low">{{forecast.low}}</p>
                        <p class ="card-text" v-model="forecast.fengxiang">{{forecast.fengxiang}}</p>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="reportModel.report == null">
            <div class="row">
                <p>
                    天气数据API服务暂不可用！
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Weather",
        data(){
        return {
            reportModel:[],
            city:'101010100',
            cityName:'北京'
        }
        },
        created: function(){
            var _this=this;
            this.$http.get('/user/cityId/'+_this.city).then(function(res){
                console.log(res);
                _this.reportModel=res.data;
                _this.city=_this.reportModel.cityId
                _this.cityName=_this.reportModel.report.data.city;
            },function(){
                console.log('请求失败处理');
            });

        },methods: {
            isEq:function () {
                var _this=this;
                var flag=this.city===this.reportModel.cityId
                return flag;
            },
            clickCity:function(obj){

                //var city=this.city;
                var _this=this;
                this.$http.get('/user/cityId/'+_this.city).then(function(res){
                    console.log(res);
                    _this.reportModel=res.data;
                    _this.city=_this.reportModel.report.city,
                    _this.cityName=_this.reportModel.report.data.city;
                },function(){
                    console.log('请求失败处理');
                });
            }

        }
    }

</script>

<style scoped>

</style>