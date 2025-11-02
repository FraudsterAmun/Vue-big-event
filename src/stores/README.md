# 数据持久化简单说明

## 什么是数据持久化？

简单来说，就是让数据在页面切换时不会丢失，避免重复请求相同的数据。

## 工作原理

### 1. 数据存储
```javascript
// 在Store中用ref存储数据
const channelList = ref([])     // 存储分类列表
const isLoaded = ref(false)     // 记录是否已经加载过
```

### 2. 缓存判断
```javascript
// 如果已经加载过，就不再发请求
if (isLoaded.value && !forceRefresh) {
  console.log('使用缓存数据')
  return channelList.value  // 直接返回已有数据
}
```

### 3. 数据获取
```javascript
// 只有在需要时才发请求
const response = await getArticleChannel()
channelList.value = response.data.data  // 保存到内存
isLoaded.value = true                   // 标记已加载
```

## 使用场景

### 场景1：首次进入页面
```
用户进入页面 → isLoaded = false → 发送请求 → 保存数据 → 显示页面
```

### 场景2：再次进入页面
```
用户再次进入 → isLoaded = true → 使用缓存 → 立即显示页面
```

### 场景3：添加新数据后
```
添加成功 → 调用refreshChannelList() → 强制刷新 → 获取最新数据
```

## 优点

1. **速度快**：第二次进入页面时，数据立即显示
2. **省流量**：避免重复请求相同数据
3. **体验好**：页面切换更流畅

## 缺点

1. **占内存**：数据存储在内存中
2. **刷新丢失**：浏览器刷新后数据会丢失
3. **需要手动刷新**：添加/删除数据后需要手动刷新缓存

## 代码结构

```
页面组件 (ArticleChannel.vue)
    ↓ 调用
Store (useChannelStore)
    ↓ 调用  
API (getArticleChannel)
    ↓ 返回
服务器数据
```

## 关键函数说明

- `getChannelList()` - 获取数据（可能使用缓存）
- `refreshChannelList()` - 强制刷新数据（不使用缓存）
- `clearCache()` - 清除缓存数据
