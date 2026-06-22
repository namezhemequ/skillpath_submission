import type { SkillNode, DailyTask, AnimationPhase } from '../types';

function genId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function dayStr(offset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
}

const ML_TREE: SkillNode[] = [
  { id: 'n1', title: 'Python 基础', description: '掌握变量、数据结构、函数、模块等核心语法', estimatedHours: 15, difficulty: 1, resources: [{ title: 'Python 官方教程', url: 'https://docs.python.org/zh-cn/3/tutorial/', type: 'article' }, { title: 'Codecademy Python', url: 'https://codecademy.com/learn/learn-python-3', type: 'course', duration: '20h' }], dependencies: [], status: 'unlocked', progress: 0 },
  { id: 'n2', title: 'NumPy 数值计算', description: '掌握 ndarray、广播、向量化计算', estimatedHours: 10, difficulty: 1, resources: [{ title: 'NumPy 官方快速入门', url: 'https://numpy.org/doc/stable/user/quickstart.html', type: 'article' }], dependencies: ['n1'], status: 'locked', progress: 0 },
  { id: 'n3', title: 'Pandas 数据处理', description: '熟练使用 DataFrame 进行数据清洗、变换、聚合', estimatedHours: 12, difficulty: 1, resources: [{ title: 'Pandas 十分钟入门', url: 'https://pandas.pydata.org/docs/user_guide/10min.html', type: 'article' }], dependencies: ['n2'], status: 'locked', progress: 0 },
  { id: 'n4', title: '线性代数', description: '理解向量、矩阵、特征值及其在 ML 中的应用', estimatedHours: 15, difficulty: 2, resources: [{ title: '3Blue1Brown 线性代数本质', url: 'https://www.3blue1brown.com/topics/linear-algebra', type: 'video', duration: '15集' }], dependencies: ['n1'], status: 'locked', progress: 0 },
  { id: 'n5', title: '概率与统计', description: '掌握概率分布、贝叶斯定理、假设检验', estimatedHours: 12, difficulty: 2, resources: [{ title: 'Khan Academy 统计与概率', url: 'https://www.khanacademy.org/math/statistics-probability', type: 'course' }], dependencies: ['n1'], status: 'locked', progress: 0 },
  { id: 'n6', title: '数据可视化', description: 'Matplotlib/Seaborn 数据图表制作', estimatedHours: 8, difficulty: 1, resources: [{ title: 'Matplotlib 教程', url: 'https://matplotlib.org/stable/tutorials/', type: 'article' }], dependencies: ['n3'], status: 'locked', progress: 0 },
  { id: 'n7', title: 'Scikit-learn 基础', description: '掌握回归、分类、聚类三大类算法', estimatedHours: 25, difficulty: 2, resources: [{ title: 'Andrew Ng 机器学习', url: 'https://www.coursera.org/learn/machine-learning', type: 'course', duration: '60h' }, { title: 'Scikit-learn 文档', url: 'https://scikit-learn.org/stable/user_guide.html', type: 'article' }], dependencies: ['n3', 'n4', 'n5'], status: 'locked', progress: 0 },
  { id: 'n8', title: '模型评估与调优', description: '交叉验证、超参数调优、偏差方差权衡', estimatedHours: 10, difficulty: 2, resources: [{ title: 'Scikit-learn 模型选择', url: 'https://scikit-learn.org/stable/model_selection.html', type: 'article' }], dependencies: ['n7'], status: 'locked', progress: 0 },
  { id: 'n9', title: '实战项目', description: '端到端完成一个 ML 项目：数据清洗→建模→评估', estimatedHours: 12, difficulty: 2, resources: [{ title: 'Kaggle Titanic', url: 'https://www.kaggle.com/c/titanic', type: 'project' }], dependencies: ['n6', 'n8'], status: 'locked', progress: 0 },
];

const ML_TASKS: DailyTask[] = [
  { id: genId(), planId: '', nodeId: 'n1', title: '安装 Python 并运行 Hello World', description: '配置好开发环境', date: dayStr(0), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'n1', title: '变量、数据类型与运算符练习', description: '掌握 int/float/str/list/dict', date: dayStr(0), completed: false, order: 2 },
  { id: genId(), planId: '', nodeId: 'n1', title: '编写猜数字小游戏', description: '综合练习条件判断和循环', date: dayStr(0), completed: false, order: 3 },
  { id: genId(), planId: '', nodeId: 'n1', title: '函数定义与模块导入', description: '理解 def/return/import', date: dayStr(1), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'n2', title: 'NumPy 数组创建与切片', description: 'np.array/reshape/索引切片', date: dayStr(2), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'n2', title: 'NumPy 广播与向量化', description: '理解 broadcasting 规则', date: dayStr(3), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'n3', title: 'Pandas 数据清洗实战', description: 'read_csv→dropna→类型转换→描述统计', date: dayStr(4), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'n3', title: 'groupby 分组聚合练习', description: '掌握 split-apply-combine', date: dayStr(5), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'n4', title: '观看 3Blue1Brown 前 5 集', description: '建立向量空间几何直觉', date: dayStr(2), completed: false, order: 2 },
  { id: genId(), planId: '', nodeId: 'n5', title: '学习正态分布、二项分布', description: '理解 PMF/PDF/CDF', date: dayStr(3), completed: false, order: 2 },
  { id: genId(), planId: '', nodeId: 'n7', title: '用 Scikit-learn 训练线性回归', description: 'fit→predict→score 完整流程', date: dayStr(8), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'n7', title: 'KNN vs Logistic Regression 对比', description: '编写对比实验', date: dayStr(10), completed: false, order: 1 },
];

// ====== 转行数据分析 ======
const DA_TREE: SkillNode[] = [
  { id: 'da1', title: 'Excel 数据分析基础', description: '掌握数据透视表、VLOOKUP、条件格式等核心功能，能独立完成基础数据整理', estimatedHours: 12, difficulty: 1, resources: [{ title: 'Excel 数据透视表教程', url: 'https://support.microsoft.com/zh-cn/excel', type: 'article' }, { title: 'B站：Excel 从入门到精通', url: 'https://www.bilibili.com/video/BV1B54y1G7px', type: 'video', duration: '8h' }], dependencies: [], status: 'unlocked', progress: 0 },
  { id: 'da2', title: 'SQL 数据查询', description: '掌握 SELECT、JOIN、GROUP BY、子查询，能独立从数据库中提取分析所需数据', estimatedHours: 18, difficulty: 1, resources: [{ title: 'SQLZoo 在线练习', url: 'https://sqlzoo.net/', type: 'project' }, { title: '牛客网 SQL 实战', url: 'https://www.nowcoder.com/ta/sql', type: 'project' }], dependencies: [], status: 'unlocked', progress: 0 },
  { id: 'da3', title: '统计学基础', description: '理解描述性统计、概率分布、假设检验、置信区间——数据分析的底层逻辑', estimatedHours: 20, difficulty: 2, resources: [{ title: '可汗学院 统计学', url: 'https://www.khanacademy.org/math/statistics-probability', type: 'course', duration: '15h' }, { title: '《赤裸裸的统计学》', url: 'https://book.douban.com/subject/25884179/', type: 'article' }], dependencies: [], status: 'unlocked', progress: 0 },
  { id: 'da4', title: 'Python 数据分析', description: 'Numpy + Pandas：DataFrame 操作、数据清洗、分组聚合、时间序列处理', estimatedHours: 25, difficulty: 1, resources: [{ title: 'Pandas 官方文档', url: 'https://pandas.pydata.org/docs/user_guide/10min.html', type: 'article' }, { title: 'Kaggle Pandas 微课程', url: 'https://www.kaggle.com/learn/pandas', type: 'course', duration: '4h' }], dependencies: [], status: 'unlocked', progress: 0 },
  { id: 'da5', title: '数据可视化', description: 'Matplotlib + Seaborn + ECharts：用图表讲故事，让数据自己说话', estimatedHours: 15, difficulty: 1, resources: [{ title: 'ECharts 官方示例', url: 'https://echarts.apache.org/examples/zh/index.html', type: 'article' }, { title: 'Seaborn 教程', url: 'https://seaborn.pydata.org/tutorial.html', type: 'article' }], dependencies: ['da4'], status: 'locked', progress: 0 },
  { id: 'da6', title: '业务指标体系', description: '理解 DAU/MAU、留存率、转化率、GMV、LTV 等核心指标，学会搭建业务看板', estimatedHours: 10, difficulty: 2, resources: [{ title: '《精益数据分析》', url: 'https://book.douban.com/subject/26278639/', type: 'article' }, { title: 'GrowingIO 数据分析模型', url: 'https://www.growingio.com/', type: 'article' }], dependencies: ['da1', 'da2'], status: 'locked', progress: 0 },
  { id: 'da7', title: 'AB 测试与实验设计', description: '掌握实验设计原则、样本量计算、显著性检验、结果解读', estimatedHours: 12, difficulty: 2, resources: [{ title: 'Udacity AB Testing', url: 'https://www.udacity.com/course/ab-testing--ud257', type: 'course', duration: '4周' }], dependencies: ['da3', 'da6'], status: 'locked', progress: 0 },
  { id: 'da8', title: '数据分析实战项目', description: '完整走一遍：明确问题→数据采集→清洗→探索分析→建模→报告输出', estimatedHours: 25, difficulty: 2, resources: [{ title: 'Kaggle 数据集', url: 'https://www.kaggle.com/datasets', type: 'project' }, { title: '阿里天池', url: 'https://tianchi.aliyun.com/', type: 'project' }], dependencies: ['da5', 'da7'], status: 'locked', progress: 0 },
];
const DA_TASKS: DailyTask[] = [
  { id: genId(), planId: '', nodeId: 'da1', title: '用 Excel 创建第一张数据透视表', description: '找个销售数据 CSV，拖出按地区×月份的销售额透视表', date: dayStr(0), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'da2', title: 'SQLZoo 完成 SELECT 基础练习', description: '从第1节做到第3节，掌握 WHERE/LIKE/ORDER BY', date: dayStr(0), completed: false, order: 2 },
  { id: genId(), planId: '', nodeId: 'da4', title: '安装 Anaconda + Jupyter Notebook', description: '配置好 Python 数据分析环境，运行第一个 cell', date: dayStr(0), completed: false, order: 3 },
  { id: genId(), planId: '', nodeId: 'da1', title: '学习 VLOOKUP 和 INDEX-MATCH', description: '完成 3 道多表关联查询练习题', date: dayStr(1), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'da2', title: '牛客网 SQL 实战：简单查询篇', description: '完成前 10 题，重点练 JOIN 和 GROUP BY', date: dayStr(1), completed: false, order: 2 },
  { id: genId(), planId: '', nodeId: 'da3', title: '学习描述性统计：均值/中位数/方差/标准差', description: '用 Excel 或 Python 手算一组数据的描述统计量', date: dayStr(1), completed: false, order: 3 },
  { id: genId(), planId: '', nodeId: 'da2', title: 'SQL 子查询与窗口函数入门', description: '完成牛客网中等难度 SQL 5 题', date: dayStr(2), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'da4', title: 'Pandas 读写 CSV/Excel + 数据筛选', description: '用 loc/iloc/query 完成 5 种常见筛选场景', date: dayStr(2), completed: false, order: 2 },
  { id: genId(), planId: '', nodeId: 'da3', title: '理解正态分布和中心极限定理', description: '看可汗学院相关视频，用 Python 模拟抽样分布', date: dayStr(3), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'da4', title: 'Pandas groupby 分组聚合实战', description: '用一个销售数据集，按 3+ 维度做聚合统计', date: dayStr(3), completed: false, order: 2 },
  { id: genId(), planId: '', nodeId: 'da6', title: '阅读《精益数据分析》前3章', description: '重点理解"第一关键指标"和不同商业模式的指标选择', date: dayStr(4), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'da5', title: 'Matplotlib 绘制折线图/柱状图/散点图', description: '用同一个数据集画 3 种图，标注标题和图例', date: dayStr(5), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'da7', title: '阅读 AB 测试经典文章+设计一个实验方案', description: '假设你想改版注册页，写出实验假设、样本量估算、判定指标', date: dayStr(7), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'da8', title: '选定一个 Kaggle 数据集开始探索', description: '明确分析目标→数据概览→缺失值处理→单变量分析', date: dayStr(9), completed: false, order: 1 },
];

// ====== 学习 Rust 系统编程 ======
const RUST_TREE: SkillNode[] = [
  { id: 'r1', title: 'Rust 基础语法', description: '变量绑定、基本类型、控制流、函数、注释——Rust 的入门基石', estimatedHours: 16, difficulty: 1, resources: [{ title: 'Rust 官方中文教程', url: 'https://rustwiki.org/zh-CN/book/', type: 'article' }, { title: 'Rustlings 练习', url: 'https://github.com/rust-lang/rustlings', type: 'project' }], dependencies: [], status: 'unlocked', progress: 0 },
  { id: 'r2', title: '所有权与借用', description: '理解 Rust 最核心的概念：ownership、borrowing、lifetime——这是 Rust 区别于所有语言的地方', estimatedHours: 20, difficulty: 3, resources: [{ title: 'Rust 程序设计语言 第4章', url: 'https://rustwiki.org/zh-CN/book/ch04-00-understanding-ownership.html', type: 'article' }, { title: 'B站：Rust 所有权深度解析', url: 'https://www.bilibili.com/video/BV1hp4y1y7R7', type: 'video', duration: '3h' }], dependencies: ['r1'], status: 'locked', progress: 0 },
  { id: 'r3', title: '结构体、枚举与模式匹配', description: '定义复合类型，用 Option/Result 处理可空值和错误，match 的威力', estimatedHours: 14, difficulty: 1, resources: [{ title: 'Rust Book 第5-6章', url: 'https://rustwiki.org/zh-CN/book/ch05-00-structs.html', type: 'article' }], dependencies: ['r1'], status: 'locked', progress: 0 },
  { id: 'r4', title: '错误处理', description: 'panic vs Result、? 运算符、自定义错误类型、thiserror/anyhow 实战', estimatedHours: 10, difficulty: 2, resources: [{ title: 'Rust Book 第9章', url: 'https://rustwiki.org/zh-CN/book/ch09-00-error-handling.html', type: 'article' }, { title: 'anyhow 文档', url: 'https://docs.rs/anyhow/latest/anyhow/', type: 'article' }], dependencies: ['r2', 'r3'], status: 'locked', progress: 0 },
  { id: 'r5', title: 'Trait 与泛型', description: '理解 trait 定义与实现、泛型约束、trait bound——Rust 的多态之道', estimatedHours: 16, difficulty: 2, resources: [{ title: 'Rust Book 第10章', url: 'https://rustwiki.org/zh-CN/book/ch10-00-generics.html', type: 'article' }], dependencies: ['r2', 'r3'], status: 'locked', progress: 0 },
  { id: 'r6', title: '并发编程', description: 'thread::spawn、Mutex、Arc、Channel、Send/Sync trait', estimatedHours: 18, difficulty: 3, resources: [{ title: 'Rust Book 第16章', url: 'https://rustwiki.org/zh-CN/book/ch16-00-concurrency.html', type: 'article' }, { title: 'Tokio 教程', url: 'https://tokio.rs/tokio/tutorial', type: 'article' }], dependencies: ['r2', 'r4'], status: 'locked', progress: 0 },
  { id: 'r7', title: '智能指针与内存管理', description: 'Box/Rc/Arc/RefCell/Cell 的使用场景，内部可变性、引用循环', estimatedHours: 14, difficulty: 2, resources: [{ title: 'Rust Book 第15章', url: 'https://rustwiki.org/zh-CN/book/ch15-00-smart-pointers.html', type: 'article' }], dependencies: ['r2'], status: 'locked', progress: 0 },
  { id: 'r8', title: 'Rust 项目实战', description: '用 Rust 实现一个简易 key-value 数据库或命令行工具，综合运用所学', estimatedHours: 25, difficulty: 2, resources: [{ title: '《Rust 实战》', url: 'https://book.douban.com/subject/35802506/', type: 'article' }, { title: 'PingCAP talent plan', url: 'https://github.com/pingcap/talent-plan', type: 'project' }], dependencies: ['r5', 'r6', 'r7'], status: 'locked', progress: 0 },
];
const RUST_TASKS: DailyTask[] = [
  { id: genId(), planId: '', nodeId: 'r1', title: '安装 Rust 工具链 (rustup + cargo)', description: '执行 rustc --version 确认安装成功，写出第一个 Hello World', date: dayStr(0), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'r1', title: '变量绑定、基本数据类型、控制流练习', description: '完成 Rustlings 的 variables + primitive_types + if 练习', date: dayStr(0), completed: false, order: 2 },
  { id: genId(), planId: '', nodeId: 'r1', title: '函数定义与返回值练习', description: '写 5 个不同类型签名的函数，体会 expression vs statement', date: dayStr(1), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'r2', title: '阅读 Rust Book 第4章：所有权', description: '重点理解 move、clone、copy 语义的区别，手写一个演示程序', date: dayStr(2), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'r2', title: '借用与引用练习', description: '完成 Rustlings move_semantics + references 练习', date: dayStr(3), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'r3', title: '定义第一个 struct + impl 块', description: '实现一个 Rectangle struct，包含 area/can_hold 方法', date: dayStr(3), completed: false, order: 2 },
  { id: genId(), planId: '', nodeId: 'r2', title: '生命周期标注练习', description: '阅读 Rust Book 第10.3节，手写 3 个需要生命周期标注的函数', date: dayStr(4), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'r3', title: 'Option 和 Result 模式匹配实战', description: '重写之前的函数，用 Option/Result 替代裸值，用 match 处理', date: dayStr(4), completed: false, order: 2 },
  { id: genId(), planId: '', nodeId: 'r4', title: '用 thiserror + anyhow 重构错误处理', description: '搭建一个小型 CLI 工具框架，统一错误处理', date: dayStr(6), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'r5', title: '定义 trait + 为不同类型实现', description: '设计一个 Summary trait，为至少 3 种 struct 实现', date: dayStr(7), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'r7', title: 'Box 和 Rc 练习：构建链表', description: '用 Box 实现单向链表，再用 Rc+RefCell 实现共享引用', date: dayStr(8), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'r6', title: '多线程 Mutex+Arc 共享状态', description: '实现一个多线程计数器，对比 Mutex vs Atomic 的性能差异', date: dayStr(10), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'r8', title: '用 Rust 实现 mini-grep', description: '仿照 Rust Book 第12章，构建一个命令行搜索工具', date: dayStr(12), completed: false, order: 1 },
];

// ====== 零基础学钢琴 ======
const PIANO_TREE: SkillNode[] = [
  { id: 'p1', title: '基础乐理', description: '音符时值、节拍、音名与唱名、半音全音、升降记号——音乐的语言', estimatedHours: 10, difficulty: 1, resources: [{ title: 'B站：基础乐理入门', url: 'https://www.bilibili.com/video/BV1GJ411x7SC', type: 'video', duration: '3h' }, { title: 'musictheory.net', url: 'https://www.musictheory.net/', type: 'article' }], dependencies: [], status: 'unlocked', progress: 0 },
  { id: 'p2', title: '钢琴坐姿与手型', description: '正确坐姿、手型、指法编号、力度控制——坏习惯是进步的敌人', estimatedHours: 4, difficulty: 1, resources: [{ title: 'B站：钢琴入门姿势', url: 'https://www.bilibili.com/video/BV1GE411a7Hx', type: 'video', duration: '30min' }, { title: '《哈农》前言', url: 'https://book.douban.com/subject/1403061/', type: 'article' }], dependencies: [], status: 'unlocked', progress: 0 },
  { id: 'p3', title: '五线谱识读', description: '高音谱号/低音谱号、线与间的音名、临时记号、节奏型读法', estimatedHours: 12, difficulty: 1, resources: [{ title: 'musictheory.net 识谱练习', url: 'https://www.musictheory.net/exercises/note', type: 'project' }], dependencies: ['p1'], status: 'locked', progress: 0 },
  { id: 'p4', title: '右手单音旋律', description: 'C大调音阶、五指位置、简单儿歌旋律（小星星/欢乐颂）', estimatedHours: 10, difficulty: 1, resources: [{ title: '《约翰·汤普森简易钢琴教程》第一册', url: 'https://book.douban.com/subject/1433186/', type: 'article' }, { title: 'B站：小汤第一册跟练', url: 'https://www.bilibili.com/video/BV1AW41127bf', type: 'video', duration: '2h' }], dependencies: ['p2', 'p3'], status: 'locked', progress: 0 },
  { id: 'p5', title: '左手伴奏基础', description: 'C/G/F 大三和弦、分解和弦伴奏型、左手独立练习', estimatedHours: 12, difficulty: 1, resources: [{ title: 'B站：左手伴奏入门', url: 'https://www.bilibili.com/video/BV1tb411u7Nh', type: 'video', duration: '2h' }], dependencies: ['p2', 'p3'], status: 'locked', progress: 0 },
  { id: 'p6', title: '双手协调练习', description: '左右手合奏基础节奏型，慢速练习→逐渐提速', estimatedHours: 15, difficulty: 2, resources: [{ title: '《拜厄钢琴基础教程》', url: 'https://book.douban.com/subject/1433169/', type: 'article' }, { title: 'B站：拜厄跟练视频', url: 'https://www.bilibili.com/video/BV1Gt41187ZP', type: 'video', duration: '5h' }], dependencies: ['p4', 'p5'], status: 'locked', progress: 0 },
  { id: 'p7', title: '基础曲目演奏', description: '完整演奏 2-3 首入门名曲（致爱丽丝简化版、卡农C大调版、天空之城）', estimatedHours: 20, difficulty: 2, resources: [{ title: '虫虫钢琴 找谱', url: 'https://www.gangqinpu.com/', type: 'article' }, { title: 'B站：致爱丽丝教学', url: 'https://www.bilibili.com/video/BV18s411L7sq', type: 'video', duration: '1h' }], dependencies: ['p6'], status: 'locked', progress: 0 },
  { id: 'p8', title: '和弦进行与即兴伴奏', description: 'I-IV-V-I 和弦进行、流行歌曲伴奏模式、简单即兴', estimatedHours: 15, difficulty: 2, resources: [{ title: 'B站：流行钢琴伴奏入门', url: 'https://www.bilibili.com/video/BV1QE411A7BP', type: 'video', duration: '3h' }], dependencies: ['p5', 'p7'], status: 'locked', progress: 0 },
  { id: 'p9', title: '进阶技巧', description: '音阶提速、琶音练习、踏板运用、力度层次处理', estimatedHours: 25, difficulty: 3, resources: [{ title: '《哈农钢琴练指法》', url: 'https://book.douban.com/subject/1403061/', type: 'article' }, { title: '《车尔尼599》', url: 'https://book.douban.com/subject/1433170/', type: 'article' }], dependencies: ['p7'], status: 'locked', progress: 0 },
];
const PIANO_TASKS: DailyTask[] = [
  { id: genId(), planId: '', nodeId: 'p1', title: '学习音符时值：全音符/二分/四分/八分', description: '用手打拍子，嘴里数"1-2-3-4"，建立节拍感', date: dayStr(0), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'p2', title: '找到钢琴中央C，练习正确坐姿', description: '手自然弯曲如握鸡蛋，手腕与琴键齐平，距离琴边一拳', date: dayStr(0), completed: false, order: 2 },
  { id: genId(), planId: '', nodeId: 'p1', title: '认识音名 CDEFGAB 和对应的唱名', description: '能在琴键上快速找出任意音的八度位置', date: dayStr(1), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'p3', title: '高音谱号五线四间 + 低音谱号五线四间', description: '用 musictheory.net 识谱练习，目标正确率 > 90%', date: dayStr(2), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'p2', title: '练习 1-5 指独立性和均匀度', description: 'C大调五指位置，慢速均匀抬起落下，每天 15 分钟', date: dayStr(1), completed: false, order: 2 },
  { id: genId(), planId: '', nodeId: 'p3', title: '识谱训练：混合高/低音谱号随机音符', description: '每天识谱练习 10 分钟，目标正确率 > 95%', date: dayStr(3), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'p4', title: '右手弹奏 C 大调音阶（一个八度）', description: '先分手慢练，每个音均匀连贯，再逐渐提速', date: dayStr(3), completed: false, order: 2 },
  { id: genId(), planId: '', nodeId: 'p4', title: '右手弹奏《小星星》', description: '先认谱→慢速单手→跟节拍器 60bpm→流畅演奏', date: dayStr(4), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'p5', title: '左手练习 C 大三和弦及分解琶音', description: 'C-E-G 柱式+分解两种模式，节拍器 50bpm 慢练', date: dayStr(5), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'p6', title: '双手合练《小星星》：右手旋律+左手单音', description: '先不加和弦，左手只弹根音 C/G，配合右手', date: dayStr(7), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'p6', title: '双手合练《欢乐颂》：旋律+C大调和弦', description: '节拍器 60bpm 起步，划分小节逐步攻克', date: dayStr(8), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'p7', title: '学习《致爱丽丝》A段（简化版）', description: '分左右手练→合手慢练→逐段提速，重点练 5-8 小节', date: dayStr(10), completed: false, order: 1 },
  { id: genId(), planId: '', nodeId: 'p8', title: '练习 C-Am-F-G 和弦进行', description: '左手柱式→分解→右手加旋律，感受流行歌曲伴奏', date: dayStr(12), completed: false, order: 1 },
];

// ====== 通用领域模板（兜底） ======
function buildDefaultTree(goal: string): { skillTree: SkillNode[]; tasks: DailyTask[] } {
  const tree: SkillNode[] = [
    { id: 'd1', title: '领域概览', description: `了解 ${goal} 的核心知识体系、行业标准和学习路线`, estimatedHours: 6, difficulty: 1, resources: [{ title: 'B站搜索入门教程', url: `https://search.bilibili.com/all?keyword=${encodeURIComponent(goal)}`, type: 'video' }, { title: '知乎搜索经验帖', url: `https://www.zhihu.com/search?type=content&q=${encodeURIComponent(goal + ' 入门')}`, type: 'article' }], dependencies: [], status: 'unlocked', progress: 0 },
    { id: 'd2', title: '核心技能 ①', description: '该领域最基础、必须优先掌握的技能模块', estimatedHours: 15, difficulty: 1, resources: [{ title: '搜索相关教程', url: '#', type: 'article' }], dependencies: ['d1'], status: 'locked', progress: 0 },
    { id: 'd3', title: '核心技能 ②', description: '与核心技能①并行的另一个基础模块', estimatedHours: 15, difficulty: 1, resources: [{ title: '搜索相关教程', url: '#', type: 'article' }], dependencies: ['d1'], status: 'locked', progress: 0 },
    { id: 'd4', title: '工具与实践', description: '将基础技能应用到实际场景，完成第一个里程碑', estimatedHours: 20, difficulty: 2, resources: [{ title: '搜索练习项目', url: '#', type: 'project' }], dependencies: ['d2', 'd3'], status: 'locked', progress: 0 },
    { id: 'd5', title: '进阶深化', description: '选择一个细分方向深入，达到能独立完成项目的水平', estimatedHours: 25, difficulty: 2, resources: [{ title: '搜索进阶资源', url: '#', type: 'article' }], dependencies: ['d4'], status: 'locked', progress: 0 },
    { id: 'd6', title: '综合实战', description: '用学到的技能完成一个完整作品，检验学习成果', estimatedHours: 20, difficulty: 2, resources: [{ title: '搜索项目案例', url: '#', type: 'project' }], dependencies: ['d5'], status: 'locked', progress: 0 },
  ];
  const tasks: DailyTask[] = [
    { id: genId(), planId: '', nodeId: 'd1', title: `搜索整理 ${goal} 的 3 个优质入门资源`, description: '挑选质量最高的学习材料，建立学习书签夹', date: dayStr(0), completed: false, order: 1 },
    { id: genId(), planId: '', nodeId: 'd1', title: `梳理 ${goal} 的知识体系导图`, description: '用思维导图画出核心模块和它们之间的关系', date: dayStr(0), completed: false, order: 2 },
    { id: genId(), planId: '', nodeId: 'd2', title: `学习 ${goal} 第一个核心模块`, description: '完成基础理论学习，做好笔记', date: dayStr(1), completed: false, order: 1 },
    { id: genId(), planId: '', nodeId: 'd3', title: `学习 ${goal} 第二个核心模块`, description: '与核心技能①并行推进，保持学习节奏', date: dayStr(2), completed: false, order: 1 },
    { id: genId(), planId: '', nodeId: 'd4', title: `动手完成 ${goal} 第一个练手任务`, description: '把学到的知识转化为实际操作，记录遇到的问题', date: dayStr(4), completed: false, order: 1 },
    { id: genId(), planId: '', nodeId: 'd5', title: `选择一个细分方向深入学习`, description: '阅读进阶资料，完成 2-3 个针对性练习', date: dayStr(7), completed: false, order: 1 },
    { id: genId(), planId: '', nodeId: 'd6', title: `完成 ${goal} 综合实战项目`, description: '独立完成一个完整作品，总结学习收获', date: dayStr(12), completed: false, order: 1 },
  ];
  return { skillTree: tree, tasks };
}

export function generateMockPlan(goal: string): { skillTree: SkillNode[]; tasks: DailyTask[] } {
  const g = goal.toLowerCase();

  if (g.includes('机器学习') || g.includes('ml') || g.includes('machine learning')) {
    return { skillTree: ML_TREE, tasks: ML_TASKS.map((t) => ({ ...t, planId: '' })) };
  }
  if (g.includes('数据分析') || g.includes('数据科学') || g.includes('data analyst')) {
    return { skillTree: DA_TREE, tasks: DA_TASKS.map((t) => ({ ...t, planId: '' })) };
  }
  if (g.includes('rust') || g.includes('系统编程')) {
    return { skillTree: RUST_TREE, tasks: RUST_TASKS.map((t) => ({ ...t, planId: '' })) };
  }
  if (g.includes('钢琴') || g.includes('键盘') || g.includes('弹琴') || g.includes('乐理')) {
    return { skillTree: PIANO_TREE, tasks: PIANO_TASKS.map((t) => ({ ...t, planId: '' })) };
  }

  return buildDefaultTree(goal);
}

export function getAnimationPhases(): AnimationPhase[] {
  return [
    { text: '正在分析你的学习目标，提取关键知识域...', icon: '🔍' },
    { text: '识别核心技能节点，评估难度与依赖...', icon: '🧩' },
    { text: '构建技能依赖关系图，规划学习路径...', icon: '🔗' },
    { text: '生成每日最小行动清单，降低启动门槛...', icon: '📋' },
  ];
}
