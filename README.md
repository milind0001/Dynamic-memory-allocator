# Dynamic Memory Allocator

## 📘 Overview
**Dynamic Memory Allocator** is a custom implementation of dynamic memory management in C++.  
It mimics the behavior of standard memory allocation functions like `malloc`, `calloc`, `realloc`, and `free`, allowing users to understand how memory management works under the hood.

This project is especially useful for systems programming learners and those interested in how memory is managed at a low level.

---

## 🧱 Key Components

### 1. Custom Heap Management
- Implements manual memory allocation and deallocation.
- Simulates heap space within user-defined memory.
- Maintains metadata for each block (e.g., size, allocation status).

### 2. Memory Block Structure
- Blocks are divided into:
  - **Used** (allocated) memory
  - **Free** (available) memory
- Includes mechanisms for:
  - Block splitting during allocation
  - Block merging during deallocation (to reduce fragmentation)

### 3. Safety & Error Handling
- Detects and prevents:
  - Double-free errors
  - Accessing freed memory
- Encourages memory-safe practices

---

## 🖥️ Platform
- Language: **C++**
- Supported OS: **Linux**, **Windows**, **macOS**
- Compiler: **GCC / Clang / MSVC** (C++17 or above)

---

## 🔧 Prerequisites
- A working **C++17** compiler
- (Optional) **Make** for Unix-based systems
- Basic understanding of pointers and memory operations

---

## 🚀 Usage

### 1. Clone the Repository
```bash
git clone https://github.com/milind0001/Dynamic-memory-allocator.git
cd Dynamic-memory-allocator

### 2. Compile the Project
```bash
g++ -std=c++17 -o allocator main.cpp allocator.cpp

### 3. Run the Program
```bash
git clone https://github.com/milind0001/Dynamic-memory-allocator.git
cd Dynamic-memory-allocator
