<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index()
    {
        return Task::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'status' => 'required|string',
            'due_date' => 'nullable|date',
            'tag' => 'nullable|string|max:50',
        ]);

        return Task::create($request->all());
    }

    public function update(Request $request, Task $task)
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'status' => 'sometimes|required|string',
            'due_date' => 'nullable|date',
            'tag' => 'nullable|string|max:50',
        ]);

        $task->update($request->all());
        return $task;
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(['message' => 'Task deleted successfully']);
    }
}