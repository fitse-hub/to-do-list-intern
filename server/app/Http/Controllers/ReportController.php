<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function statistics(Request $request)
    {
        $user = $request->user();
        
        $timeRange = $request->query('time_range', 'all'); // today, weekly, monthly, custom, all
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        $categoryId = $request->query('category_id');
        
        $query = $user->tasks()->with('category');
        
        if ($categoryId && $categoryId !== 'all') {
            $query->where('category_id', $categoryId);
        }
        
        // We will fetch tasks and do analytics
        $tasks = $query->get();
        
        // Filter by time range
        $filteredTasks = $tasks->filter(function($task) use ($timeRange, $startDate, $endDate) {
            if ($timeRange === 'all') return true;
            
            $now = Carbon::now();
            $taskDate = $task->created_at; // use created_at as base for time range filtering or due_date? 
            // We can just filter tasks that were either created, completed, or due in this time range.
            // Let's simplify: A task belongs to the report if its created_at OR completed_at is in the range
            
            $inRange = false;
            
            if ($timeRange === 'today') {
                $inRange = $task->created_at->isToday() || ($task->completed_at && $task->completed_at->isToday());
            } elseif ($timeRange === 'weekly') {
                $startOfWeek = $now->copy()->startOfWeek();
                $endOfWeek = $now->copy()->endOfWeek();
                $inRange = $task->created_at->between($startOfWeek, $endOfWeek) || 
                           ($task->completed_at && $task->completed_at->between($startOfWeek, $endOfWeek));
            } elseif ($timeRange === 'monthly') {
                $inRange = $task->created_at->isCurrentMonth() || ($task->completed_at && $task->completed_at->isCurrentMonth());
            } elseif ($timeRange === 'custom' && $startDate && $endDate) {
                $start = Carbon::parse($startDate)->startOfDay();
                $end = Carbon::parse($endDate)->endOfDay();
                $inRange = $task->created_at->between($start, $end) || 
                           ($task->completed_at && $task->completed_at->between($start, $end));
            }
            
            return $inRange;
        });
        
        if ($timeRange === 'all') {
            $filteredTasks = $tasks;
        }

        $totalTasks = $filteredTasks->count();
        $completedTasks = $filteredTasks->where('status', 'completed')->count();
        $todoTasks = $filteredTasks->where('status', 'todo')->count();
        $failedTasks = $filteredTasks->where('status', 'failed')->count();
        
        $completionRate = $totalTasks > 0 ? round(($completedTasks / $totalTasks) * 100) : 0;
        $productivityScore = $completionRate; // basic productivity score
        $failureRate = $totalTasks > 0 ? round(($failedTasks / $totalTasks) * 100) : 0;
        
        // Category performance
        $categoryPerformance = [];
        foreach ($filteredTasks as $task) {
            $catName = $task->category ? $task->category->name : 'General';
            if (!isset($categoryPerformance[$catName])) {
                $categoryPerformance[$catName] = ['total' => 0, 'completed' => 0, 'failed' => 0, 'todo' => 0];
            }
            $categoryPerformance[$catName]['total']++;
            $categoryPerformance[$catName][$task->status]++;
        }
        
        // Priority performance
        $priorityPerformance = [
            'high' => ['total' => 0, 'completed' => 0],
            'medium' => ['total' => 0, 'completed' => 0],
            'low' => ['total' => 0, 'completed' => 0],
        ];
        
        foreach ($filteredTasks as $task) {
            $pri = $task->priority ?? 'low';
            $priorityPerformance[$pri]['total']++;
            if ($task->status === 'completed') {
                $priorityPerformance[$pri]['completed']++;
            }
        }
        
        foreach ($priorityPerformance as $pri => $data) {
            $priorityPerformance[$pri]['rate'] = $data['total'] > 0 ? round(($data['completed'] / $data['total']) * 100) : 0;
        }
        
        // Daily Activity (Line chart: Last 30 days to support heatmap and trend)
        $dailyActivity = [];
        $daysToLookBack = 30;
        if ($timeRange === 'weekly') $daysToLookBack = 7;
        
        for ($i = $daysToLookBack - 1; $i >= 0; $i--) {
            $dateStr = Carbon::now()->subDays($i)->format('Y-m-d');
            $dailyActivity[$dateStr] = ['created' => 0, 'completed' => 0];
        }
        
        foreach ($tasks as $task) {
            $createdDateStr = $task->created_at->format('Y-m-d');
            if (isset($dailyActivity[$createdDateStr])) {
                $dailyActivity[$createdDateStr]['created']++;
            }
            
            if ($task->completed_at) {
                $completedDateStr = $task->completed_at->format('Y-m-d');
                if (isset($dailyActivity[$completedDateStr])) {
                    $dailyActivity[$completedDateStr]['completed']++;
                }
            }
        }

        // Streak tracking
        $currentStreak = 0;
        
        // Create an array of dates where at least one task was completed
        $completedDates = [];
        foreach ($tasks as $task) {
            if ($task->completed_at) {
                $completedDates[$task->completed_at->format('Y-m-d')] = true;
            }
        }
        
        $todayStr = Carbon::now()->format('Y-m-d');
        $yesterdayStr = Carbon::now()->subDay()->format('Y-m-d');

        $checkDate = null;
        if (isset($completedDates[$todayStr])) {
            $checkDate = Carbon::now();
        } elseif (isset($completedDates[$yesterdayStr])) {
            $checkDate = Carbon::now()->subDay();
        }

        if ($checkDate) {
            while (isset($completedDates[$checkDate->format('Y-m-d')])) {
                $currentStreak++;
                $checkDate->subDay();
            }
        }

        return response()->json([
            'summary' => [
                'total' => $totalTasks,
                'completed' => $completedTasks,
                'todo' => $todoTasks,
                'failed' => $failedTasks,
                'completionRate' => $completionRate,
                'productivityScore' => $productivityScore,
                'failureRate' => $failureRate,
            ],
            'categoryPerformance' => $categoryPerformance,
            'priorityPerformance' => $priorityPerformance,
            'dailyActivity' => $dailyActivity,
            'streak' => $currentStreak
        ]);
    }
}
