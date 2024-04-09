<template>
    <div style="height: 100vh; display: flex; flex-direction: column;">
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 12px;">
            <h2>业余无线电考试</h2>
            <div>选择题库</div>
            <v-btn class="bg-indigo-lighten-2" to="/a" type="primary" variant="tonal">A类题库</v-btn>
            <v-btn class="bg-indigo-lighten-2" to="/b" type="primary" variant="tonal">B类题库</v-btn>
            <v-btn class="bg-indigo-lighten-2" to="/c" type="primary" variant="tonal">C类题库</v-btn>
        </div>
        <div style="height: 24px; display: flex; justify-content: center; align-items: center; font-size: 10px;">
            <a class="text-blue-darken-4" href="https://beian.miit.gov.cn/">浙ICP备20025327号-2</a>
        </div>
    </div>
</template>