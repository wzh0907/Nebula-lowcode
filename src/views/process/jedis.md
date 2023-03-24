星云座流程使用自定义代码连接Redis



简介

流程可以引入redis.clients.jedis.Jedis，来操作redis

有不会的完全可以搜索jedis

1.连接

几种连接条件

1.1 只有ip或者域名，由于redis的端口默认是6379

```
redis.clients.jedis.Jedis jedis = new redis.clients.jedis.Jedis(ip,6379)
```



1.2 只有ip和端口port,用实际的值替换下面代码的ip和port参数

```
redis.clients.jedis.Jedis jedis = new redis.clients.jedis.Jedis(ip,port)
```



1.3 ip+port+password,用实际的值替换下面代码的ip和port和password参数

```
redis.clients.jedis.Jedis jedis = new redis.clients.jedis.Jedis(ip,port)
jedis.auth(password)
```

1.4ip+port+username+password,用实际的值替换下面代码的ip和port和username、password参数

```
redis.clients.jedis.Jedis jedis = new redis.clients.jedis.Jedis(ip,port)
jedis.auth(username,password)
```



2 指定特定的db

默认redis有16个，你可以采用以下命令指定你想使用的db索引号

```
jedis.select(10)
```

3.简单操作，具体可以参考上面的连接去看文档

## Redis Java String(字符串) 实例

```
 //设置 redis 字符串数据
 jedis.set("runoobkey", "www.runoob.com")
 // 获取存储的数据并输出
System.out.println("redis 存储的字符串为: "+ jedis.get("runoobkey"))



System.out.println(jedis.set("key1", "value1"))  
System.out.println(jedis.set("key2", "value2"))  
System.out.println(jedis.set("key3", "value3"))  
System.out.println("删除键key2" + jedis.del("key2"))  
System.out.println("获取键key2" + jedis.get("key2"))  
System.out.println("修改key1" + jedis.set("key1", "valueChanged"))  
System.out.println("获取key1的值" + jedis.get("key1"))  
System.out.println("在key3后面加入值" + jedis.append("key3", "end"))  
System.out.println("key3的值" + jedis.get("key3"))  
System.out.println("增加多个键值对: " + jedis.mset("key01", "value01", "key02", "value02"))  
System.out.println("获取多个键值对: " + jedis.mget("key01", "key02", "key03"))  
System.out.println("获取多个键值对: " + jedis.mget("key01", "key02", "key03", "key04"))  
System.out.println("删除多个键值对: " + jedis.del("key01", "key02"))  
System.out.println("获取多个键值对: " + jedis.mget("key01", "key02", "key03"))  

jedis.flushDB()  
System.out.println("=====新增键值对防止覆盖原先值=====")  
System.out.println(jedis.setnx("key1", "value1"))  
System.out.println(jedis.setnx("key2", "value2"))  
System.out.println(jedis.setnx("key2", "value2-new"))  
System.out.println(jedis.get("key1"))  
System.out.println(jedis.get("key2"))  

System.out.println("=====新增键值对并设置有效时间=====")  
System.out.println(jedis.setex("key3", 2, "value3"))  
System.out.println(jedis.get("key3"))  
try {
TimeUnit.SECONDS.sleep(3)  
} catch (InterruptedException e) {
e.printStackTrace()  
}
System.out.println(jedis.get("key3"))  


System.out.println("=====获取原值, 更新为新值=====")  
System.out.println(jedis.getSet("key2", "key2GetSet"))  
System.out.println(jedis.get("key2"))  

System.out.println("获得key2的值字符串: " + jedis.getrange("key2", 2, 4))  
```

## Redis Java List(列表) 实例

```
//存储数据到列表中
jedis.lpush("site-list", "Runoob")
jedis.lpush("site-list", "Google")
jedis.lpush("site-list", "Taobao")
// 获取存储的数据并输出
List<String> list = jedis.lrange("site-list", 0 ,2)
for(int i=0   i<list.size()   i++) {
	System.out.println("列表项为: "+list.get(i))
}


System.out.println("=====添加一个List=====")  
jedis.lpush("collections", "ArrayList", "Vector", "Stack", "HashMap", "WeakHashMap", "LinkedHashMap")  
jedis.lpush("collections", "HashSet")  
jedis.lpush("collections", "TreeSet")  
jedis.lpush("collections", "TreeMap")  
System.out.println("collections的内容" + jedis.lrange("collections", 0, -1))  // -1代表倒数
System.out.println("collections区间 0-3 的元素: " + jedis.lrange("collections", 2, 3))  

System.out.println("===========================================")  
// 删除列表指定的值, 第二个参数为删除的个数(有重复时), 后add进去的值先被删, 类似于出栈
System.out.println("删除指定元素个数: " + jedis.lrem("collectionws", 2, "HashMap"))  
System.out.println("collections的内容: " + jedis.lrange("collections", 0, -1))  
System.out.println("删除下表0-3区间之外的元素: " + jedis.ltrim("collections", 0, 3))  
System.out.println("collections内容: " + jedis.lrange("collections", 0, -1))  
System.out.println("collections列表出栈(左端): " + jedis.lpop("collections"))  
System.out.println("collections的内容: " + jedis.lrange("collections", 0, -1))  
System.out.println("collections添加元素, 从列表右端, 与lpush相对应: " + jedis.rpush("collections", "test"))  
System.out.println("collections的内容: " + jedis.lrange("collections", 0, -1))  
System.out.println("collections列表出栈(右端): " + jedis.rpop("collections"))  
System.out.println("collections的内容: " + jedis.lrange("collections", 0, -1))  
System.out.println("collections指定下标 1 的内容: " + jedis.lset("collections", 1, "FLinkedHashMap"))  
System.out.println("collections的内容: " + jedis.lrange("collections", 0, -1))  

System.out.println("===========================================")  
System.out.println("collections的长度: " + jedis.llen("collections"))  
System.out.println("获取collections下标为 2 的元素" + jedis.lindex("collections", 2))  
System.out.println("===========================================")  
jedis.lpush("sortedList", "3", "6", "2", "4", "5", "7", "9")  
System.out.println("sortedList排序前: " + jedis.lrange("sortedList", 0, -1))  
System.out.println(jedis.sort("sortedList"))  
System.out.println("sortedList排序后：" + jedis.lrange("sortedList", 0, -1))  

```

## Redis Java Keys 实例

```
 // 获取数据并输出
 Set<String> keys = jedis.keys("*")
 Iterator<String> it=keys.iterator()  
 while(it.hasNext()){   
 String key = it.next() 
 System.out.println(key)
 }
```

### **Set(集合)**

```

System.out.println("======向集合中添加元素(不重复)======")  
System.out.println(jedis.sadd("eleSet", "e0", "e1", "e2", "e3", "e4", "e5"))  
System.out.println(jedis.sadd("eleSet", "e6"))  
System.out.println(jedis.sadd("eleSet", "e6"))  
System.out.println("eleSet的所有元素为: " + jedis.smembers("eleSet"))  
System.out.println("删除一个元素e0" + jedis.srem("eleSet", "e0"))  
System.out.println("删除两个元素e6 e7" + jedis.srem("eleSet", "e7", "e6"))  
System.out.println("eleSet的所有元素为: " + jedis.smembers("eleSet"))  
System.out.println("随机移除集合中的一个元素: " + jedis.spop("eleSet"))  
System.out.println("随机移除集合中的一个元素: " + jedis.spop("eleSet"))  
System.out.println("eleSet的所有元素为: " + jedis.smembers("eleSet"))  
System.out.println("eleSet中包含元素的个数: " + jedis.scard("eleSet"))  
System.out.println("e3是否在eleSet中: " + jedis.sismember("eleSet", "e3"))  
System.out.println("e1是否在eleSet中: " + jedis.sismember("eleSet", "e1"))  
System.out.println("e5是否在eleSet中: " + jedis.sismember("eleSet", "e5"))  
System.out.println("========================================")  
System.out.println(jedis.sadd("eleSet1", "e0", "e1", "e2", "e3", "e4", "e5"))  
System.out.println(jedis.sadd("eleSet2", "e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8"))  
System.out.println("将eleSet1中删除e1并存入eleSet3中: " + jedis.smove("eleSet1", "eleSet3", "e1"))  
System.out.println("将eleSet2中删除e2并存入eleSet3中: " + jedis.smove("eleSet2", "eleSet3", "e2"))  
System.out.println("eleSet1中的元素: " + jedis.smembers("eleSet1"))  
System.out.println("eleSet2中的元素: " + jedis.smembers("eleSet2"))  
System.out.println("=====集合运算=====")  
System.out.println("eleSet1中的元素: " + jedis.smembers("eleSet1"))  
System.out.println("eleSet2中的元素: " + jedis.smembers("eleSet2"))  
System.out.println("eleSet1和eleSet2的交集" + jedis.sinter("eleSet1", "eleSet2"))  
System.out.println("eleSet1和eleSet2的并集" + jedis.sunion("eleSet1", "eleSet2"))  
System.out.println("eleSet1和eleSet2的差集" + jedis.sdiff("eleSet1", "eleSet2"))   //eleSet1中有, EleSet2中没有
jedis.sinterstore("eleSet4", "eleSet1", "eleSet2")   //求交集并将交集保存到 dstkey的集合
System.out.println("eleSet4中的元素: " + jedis.smembers("eleSet4"))  
```

### **Hash(哈希)**

```
Map<String, String> map = new HashMap<>()  
map.put("key1", "value1")  
map.put("key2", "value2")  
map.put("key3", "value3")  
map.put("key4", "value4")  
//添加名称为hash(key) 的hash元素
jedis.hmset("hash", map)  
//向名称为hash的hash中添加key为key5, value为value5的元素
jedis.hset("hash", "key5", "value5")  
System.out.println("散列hash的所有键值对为: " + jedis.hgetAll("hash"))  
System.out.println("散列hash的所有的键为: " + jedis.hkeys("hash"))   //return Set<String>
System.out.println("散列hash的所有的值为: " + jedis.hvals("hash"))   //return List<String>
System.out.println("将key6保存的值加上一个整数, 如果key6不存在则添加key6: " + jedis.hincrBy("hash", "key6", 1))  
System.out.println("散列hash的所有键值对为: " + jedis.hgetAll("hash"))  
System.out.println("将key6保存的值加上一个整数, 如果key6不存在则添加key6: " + jedis.hincrByFloat("hash", "key6", 1.0))  
System.out.println("散列hash的所有键值对为: " + jedis.hgetAll("hash"))  
System.out.println("删除一个或多个键值对: " + jedis.hdel("hash", "key2"))  
System.out.println("散列hash的所有键值对为: " + jedis.hgetAll("hash"))  
System.out.println("散列hash的所有键值对个数: " + jedis.hlen("hash"))  
System.out.println("判断散列hash中是否存在key2: " + jedis.hexists("hash", "key2"))  
System.out.println("判断散列hash中是否存在key3: " + jedis.hexists("hash", "key3"))  
System.out.println("获取hash中的值: " + jedis.hmget("hash", "key3"))  
System.out.println("获取hash中的值: " + jedis.hmget("hash", "key3", "key4"))  

```

