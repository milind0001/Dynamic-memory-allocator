// DOM elements
const codeInput = document.getElementById('codeInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const exampleBtn = document.getElementById('exampleBtn');
const resultsSection = document.getElementById('resultsSection');

// Results elements
const totalLines = document.getElementById('totalLines');
const totalFunctions = document.getElementById('totalFunctions');
const totalDataVars = document.getElementById('totalDataVars');
const totalStackVars = document.getElementById('totalStackVars');
const totalHeapVars = document.getElementById('totalHeapVars');

// Tab elements
const functionsList = document.getElementById('functionsList');
const dataList = document.getElementById('dataList');
const stackList = document.getElementById('stackList');
const heapList = document.getElementById('heapList');

// Example code
const exampleCode = `#include <iostream>
#include <vector>

int globalVar = 10;  // Data section

int main() {
    int localVar = 5;  // Stack section
    int* heapVar = new int(15);  // Heap section
    
    std::vector<int> vec;  // Stack section
    vec.push_back(1);
    
    delete heapVar;  // Memory cleanup
    return 0;
}

void helperFunction() {
    double* array = new double[100];  // Heap section
    int temp = 42;  // Stack section
    
    delete[] array;  // Memory cleanup
}`;

// Event listeners
analyzeBtn.addEventListener('click', analyzeCode);
clearBtn.addEventListener('click', clearAll);
exampleBtn.addEventListener('click', loadExample);

// Tab functionality
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        switchTab(tabName);
    });
});

function analyzeCode() {
    const code = codeInput.value.trim();
    
    if (!code) {
        showError('Please enter some C++ code to analyze.');
        return;
    }
    
    // Show loading state
    analyzeBtn.innerHTML = '<span class="loading"></span> Analyzing...';
    analyzeBtn.disabled = true;
    
    // Simulate analysis delay
    setTimeout(() => {
        const analysis = performAnalysis(code);
        displayResults(analysis);
        
        // Reset button
        analyzeBtn.innerHTML = '<i class="fas fa-play"></i> Analyze Code';
        analyzeBtn.disabled = false;
    }, 1500);
}

function performAnalysis(code) {
    const lines = code.split('\n').filter(line => line.trim() !== '');
    const analysis = {
        totalLines: lines.length,
        functions: [],
        dataVars: [],
        stackVars: [],
        heapVars: []
    };
    
    // Simple regex patterns for analysis
    const functionPattern = /\b(int|void|double|float|char|bool|string)\s+\w+\s*\([^)]*\)\s*\{/g;
    const dataPattern = /\b(int|double|float|char|bool|string)\s+\w+\s*=\s*[^;]+;/g;
    const stackPattern = /\b(int|double|float|char|bool|string)\s+\w+\s*[=;]/g;
    const heapPattern = /\bnew\s+\w+/g;
    
    // Analyze each line
    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        
        // Check for functions
        if (functionPattern.test(trimmedLine)) {
            const funcName = extractFunctionName(trimmedLine);
            if (funcName) {
                analysis.functions.push(funcName);
            }
        }
        
        // Check for data section variables (global variables)
        if (dataPattern.test(trimmedLine) && !isInsideFunction(code, index)) {
            const varName = extractVariableName(trimmedLine);
            if (varName) {
                analysis.dataVars.push(trimmedLine);
            }
        }
        
        // Check for stack variables (local variables)
        if (stackPattern.test(trimmedLine) && isInsideFunction(code, index)) {
            const varName = extractVariableName(trimmedLine);
            if (varName && !trimmedLine.includes('new')) {
            // Filter out loop variables and only include actual variable declarations
            // Skip lines that are part of for/while loops or contain increment/decrement
                if (!trimmedLine.match(/for\s*\(.*\)/) && 
                    !trimmedLine.match(/while\s*\(.*\)/) &&
                    !trimmedLine.includes('++') && 
                    !trimmedLine.includes('--') &&
                    !trimmedLine.match(/.*\s*=\s*.*\s*[+\-*/]/)) {
                    analysis.stackVars.push(trimmedLine);
                }
            }
        }
        
        // Check for heap variables (dynamic allocation)
        if (heapPattern.test(trimmedLine)) {
            analysis.heapVars.push(trimmedLine);
        }
    });
    
    return analysis;
}

function extractFunctionName(line) {
    const match = line.match(/\b(int|void|double|float|char|bool|string)\s+(\w+)\s*\(/);
    return match ? match[2] : null;
}

function extractVariableName(line) {
    const match = line.match(/\b(int|double|float|char|bool|string)\s+(\w+)/);
    return match ? match[2] : null;
}

function isInsideFunction(code, lineIndex) {
    const lines = code.split('\n');
    let braceCount = 0;
    
    for (let i = 0; i < lineIndex; i++) {
        const line = lines[i];
        braceCount += (line.match(/\{/g) || []).length;
        braceCount -= (line.match(/\}/g) || []).length;
    }
    
    return braceCount > 0;
}

function displayResults(analysis) {
    // Update overview cards
    totalLines.textContent = analysis.totalLines;
    totalFunctions.textContent = analysis.functions.length;
    totalDataVars.textContent = analysis.dataVars.length;
    totalStackVars.textContent = analysis.stackVars.length;
    totalHeapVars.textContent = analysis.heapVars.length;
    
    // Update detailed sections
    functionsList.textContent = analysis.functions.length > 0 
        ? analysis.functions.join('\n') 
        : 'No functions found';
    
    dataList.textContent = analysis.dataVars.length > 0 
        ? analysis.dataVars.join('\n') 
        : 'No data variables found';
    
    stackList.textContent = analysis.stackVars.length > 0 
        ? analysis.stackVars.join('\n') 
        : 'No stack variables found';
    
    heapList.textContent = analysis.heapVars.length > 0 
        ? analysis.heapVars.join('\n') 
        : 'No heap variables found';
    
    // Show results section
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    
    // Add success state to input
    codeInput.classList.add('success');
    setTimeout(() => {
        codeInput.classList.remove('success');
    }, 3000);
}

function switchTab(tabName) {
    // Remove active class from all tabs and panes
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    
    // Add active class to selected tab and pane
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
}


function loadExample() {
    codeInput.value = exampleCode;

    // Enable analyze button since example is now loaded
    analyzeBtn.disabled = false;

    codeInput.classList.add('success');
    setTimeout(() => {
        codeInput.classList.remove('success');
    }, 2000);
}



function clearAll() {
    codeInput.value = '';
    resultsSection.style.display = 'none';
    codeInput.classList.remove('success', 'error');
}

function showError(message) {
    codeInput.classList.add('error');
    setTimeout(() => {
        codeInput.classList.remove('error');
    }, 3000);
    
    // You could also show a toast notification here
    console.error(message);
}

// Add some interactive features
codeInput.addEventListener('input', () => {
    if (codeInput.value.trim()) {
        analyzeBtn.disabled = false;
    } else {
        analyzeBtn.disabled = true;
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        analyzeCode();
    }
    if (e.ctrlKey && e.key === 'l') {
        clearAll();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    analyzeBtn.disabled = true;

}); 

