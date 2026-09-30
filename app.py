from flask import Flask, render_template_string, request, redirect

app = Flask(__name__)

courses = [
    {"name": "Web Development", "icon": "💻", "progress": 80, "level": "Intermediate", "lessons": 12},
    {"name": "Python Programming", "icon": "🐍", "progress": 65, "level": "Beginner", "lessons": 10},
    {"name": "Data Science", "icon": "📊", "progress": 45, "level": "Intermediate", "lessons": 15},
    {"name": "UI/UX Design", "icon": "🎨", "progress": 30, "level": "Beginner", "lessons": 8}
]

html = """
<!DOCTYPE html>
<html>
<head>
<title>SkillUp</title>
<meta name="viewport" content="width=device-width, initial-scale=1">

<style>
*{box-sizing:border-box}
body{
    margin:0;
    font-family:Arial,sans-serif;
    background:#0f172a;
    color:#f8fafc;
}
.sidebar{
    position:fixed;
    left:0;
    top:0;
    width:230px;
    height:100vh;
    background:#111827;
    padding:25px 15px;
}
.logo{
    font-size:25px;
    font-weight:bold;
    margin-bottom:35px;
    text-align:center;
}
.nav{
    padding:14px;
    margin:8px 0;
    border-radius:10px;
    cursor:pointer;
}
.nav:hover{
    background:#1e293b;
}
.main{
    margin-left:230px;
    padding:35px;
}
.header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:30px;
}
.search{
    background:#1e293b;
    border:none;
    padding:13px;
    border-radius:10px;
    color:white;
    width:250px;
}
.stats{
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:20px;
}
.stat,.card,.panel{
    background:#1e293b;
    border-radius:15px;
    padding:22px;
}
.stat h2{
    margin:5px 0;
}
.cards{
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:20px;
    margin-top:20px;
}
.course-icon{
    font-size:35px;
}
.progress{
    height:9px;
    background:#334155;
    border-radius:10px;
    overflow:hidden;
    margin:15px 0;
}
.bar{
    height:100%;
    background:#38bdf8;
}
button{
    background:#38bdf8;
    border:none;
    padding:11px 18px;
    border-radius:8px;
    cursor:pointer;
    font-weight:bold;
}
button:hover{
    opacity:.85;
}
.section{
    display:none;
}
.section.active{
    display:block;
}
.badge{
    display:inline-block;
    background:#334155;
    padding:15px;
    border-radius:12px;
    margin:8px;
}
table{
    width:100%;
    border-collapse:collapse;
}
td,th{
    padding:15px;
    border-bottom:1px solid #334155;
    text-align:left;
}
.profile{
    display:flex;
    gap:20px;
    align-items:center;
}
.avatar{
    width:80px;
    height:80px;
    border-radius:50%;
    background:#38bdf8;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:30px;
}
@media(max-width:800px){
    .sidebar{width:180px}
    .main{margin-left:180px}
    .stats,.cards{grid-template-columns:1fr}
}
</style>
</head>

<body>

<div class="sidebar">
    <div class="logo">🎓 SkillUp</div>

    <div class="nav" onclick="show('dashboard')">🏠 Dashboard</div>
    <div class="nav" onclick="show('courses')">📚 My Courses</div>
    <div class="nav" onclick="show('progress')">📈 Progress</div>
    <div class="nav" onclick="show('achievements')">🏆 Achievements</div>
    <div class="nav" onclick="show('profile')">👤 Profile</div>
    <div class="nav" onclick="show('settings')">⚙️ Settings</div>
</div>

<div class="main">

<div id="dashboard" class="section active">

<div class="header">
    <div>
        <h1>Welcome back, Student 👋</h1>
        <p>Continue your learning journey.</p>
    </div>
    <input class="search" placeholder="Search courses..." onkeyup="searchCourses(this.value)">
</div>

<div class="stats">
    <div class="stat">
        <p>Courses</p>
        <h2>4</h2>
    </div>

    <div class="stat">
        <p>Lessons Completed</p>
        <h2>27</h2>
    </div>

    <div class="stat">
        <p>Overall Progress</p>
        <h2>55%</h2>
    </div>

    <div class="stat">
        <p>Certificates</p>
        <h2>2</h2>
    </div>
</div>

<h2>My Courses</h2>

<div class="cards">

{% for course in courses %}
<div class="card course-card">
    <div class="course-icon">{{course.icon}}</div>
    <h2>{{course.name}}</h2>
    <p>{{course.level}} • {{course.lessons}} Lessons</p>

    <div class="progress">
        <div class="bar" style="width:{{course.progress}}%"></div>
    </div>

    <p>{{course.progress}}% completed</p>

    <form method="POST">
        <input type="hidden" name="course" value="{{course.name}}">
        <button>Complete Lesson</button>
    </form>
</div>
{% endfor %}

</div>
</div>

<div id="courses" class="section">
<h1>📚 My Courses</h1>

<div class="cards">
{% for course in courses %}
<div class="card">
<h2>{{course.icon}} {{course.name}}</h2>
<p>Level: {{course.level}}</p>
<p>{{course.lessons}} lessons available</p>
<button onclick="show('lesson')">Start Learning</button>
</div>
{% endfor %}
</div>
</div>

<div id="progress" class="section">
<h1>📈 Learning Progress</h1>

<div class="panel">
<table>
<tr>
<th>Course</th>
<th>Progress</th>
<th>Status</th>
</tr>

{% for course in courses %}
<tr>
<td>{{course.name}}</td>
<td>{{course.progress}}%</td>
<td>{{"Completed" if course.progress >= 80 else "In Progress"}}</td>
</tr>
{% endfor %}

</table>
</div>
</div>

<div id="achievements" class="section">
<h1>🏆 Achievements</h1>

<div class="panel">
<div class="badge">🏅 First Course</div>
<div class="badge">🔥 7 Day Streak</div>
<div class="badge">📚 20 Lessons</div>
<div class="badge">🎯 Skill Builder</div>
</div>
</div>

<div id="profile" class="section">
<h1>👤 Profile</h1>

<div class="panel profile">
<div class="avatar">👨‍🎓</div>
<div>
<h2>Student</h2>
<p>Learning enthusiast</p>
<p>Courses enrolled: 4</p>
</div>
</div>
</div>

<div id="settings" class="section">
<h1>⚙️ Settings</h1>

<div class="panel">
<h3>Account Settings</h3>
<p>🔔 Notifications: Enabled</p>
<p>🌙 Dark Mode: Enabled</p>
<p>🔒 Privacy: Standard</p>
<button>Save Settings</button>
</div>
</div>

<div id="lesson" class="section">
<h1>📖 Learning Center</h1>

<div class="panel">
<h2>Continue Learning</h2>
<p>Choose a course and continue completing lessons.</p>
<button onclick="show('courses')">View Courses</button>
</div>
</div>

</div>

<script>

function show(id){
    document.querySelectorAll('.section').forEach(x=>{
        x.classList.remove('active');
    });

    document.getElementById(id).classList.add('active');
}

function searchCourses(value){
    value=value.toLowerCase();

    document.querySelectorAll('.course-card').forEach(card=>{
        card.style.display=
        card.innerText.toLowerCase().includes(value)
        ? 'block'
        : 'none';
    });
}

</script>

</body>
</html>
"""

@app.route("/", methods=["GET", "POST"])
def home():

    if request.method == "POST":

        course_name = request.form.get("course")

        for course in courses:
            if course["name"] == course_name:
                course["progress"] = min(100, course["progress"] + 10)

        return redirect("/")

    return render_template_string(html, courses=courses)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8004)
