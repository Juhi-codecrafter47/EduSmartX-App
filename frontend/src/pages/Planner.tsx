import React, { useState, useEffect } from 'react';
import { Plus, MoreVertical, Check, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Define types for our Kanban board
interface Task {
  id: string;
  title: string;
  tags: {
    text: string;
    color: 'enhancement' | 'design' | 'bug' | 'devops' | 'done';
  }[];
}

interface Column {
  id: string;
  title: string;
  icon: string;
  count: number;
  tasks: Task[];
}

const Planner = () => {
  // Initial board data that matches the image
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'todo',
      title: 'Todo',
      icon: '📋',
      count: 2,
      tasks: [
        {
          id: 'task-1',
          title: 'Login view form',
          tags: [{ text: 'Enhancement', color: 'enhancement' }]
        },
        {
          id: 'task-2',
          title: 'Implement Landing Page',
          tags: [{ text: 'Enhancement', color: 'enhancement' }]
        }
      ]
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      icon: '🔄',
      count: 3,
      tasks: [
        {
          id: 'task-3',
          title: 'Landing Page hero block',
          tags: [
            { text: 'Needs Review', color: 'enhancement' },
            { text: 'Design', color: 'design' }
          ]
        },
        {
          id: 'task-4',
          title: 'Landing Page footer',
          tags: [
            { text: 'Needs Review', color: 'enhancement' },
            { text: 'Design', color: 'design' }
          ]
        },
        {
          id: 'task-5',
          title: 'Project setup documentation',
          tags: [{ text: 'Done', color: 'done' }]
        }
      ]
    },
    {
      id: 'done',
      title: 'Done',
      icon: '✅',
      count: 2,
      tasks: [
        {
          id: 'task-6',
          title: 'Registration view form',
          tags: [{ text: 'Enhancement', color: 'enhancement' }]
        },
        {
          id: 'task-7',
          title: 'Setup staging server',
          tags: [{ text: 'DevOps', color: 'devops' }]
        }
      ]
    },
    {
      id: 'backlog',
      title: 'Backlog',
      icon: '📚',
      count: 3,
      tasks: [
        {
          id: 'task-8',
          title: 'Email verification gives 500',
          tags: [{ text: 'Bug', color: 'bug' }]
        },
        {
          id: 'task-9',
          title: 'Prepare runners for Continuous Integration',
          tags: [{ text: 'DevOps', color: 'devops' }]
        },
        {
          id: 'task-10',
          title: 'Search Bar',
          tags: [{ text: 'Enhancement', color: 'enhancement' }]
        }
      ]
    }
  ]);

  // Load board data from localStorage on component mount
  useEffect(() => {
    const savedColumns = localStorage.getItem('plannerColumns');
    if (savedColumns) {
      try {
        const parsedColumns = JSON.parse(savedColumns);
        // Update the count for each column based on the actual number of tasks
        const columnsWithCorrectCounts = parsedColumns.map((col: Column) => ({
          ...col,
          count: col.tasks.length
        }));
        setColumns(columnsWithCorrectCounts);
      } catch (error) {
        console.error('Error parsing saved columns:', error);
      }
    }
  }, []);

  // Save board data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('plannerColumns', JSON.stringify(columns));
  }, [columns]);

  // Function to add a new card to a column
  const addCard = (columnId: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: 'New Task',
      tags: []
    };

    setColumns(columns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: [...column.tasks, newTask],
          count: column.count + 1
        };
      }
      return column;
    }));
  };

  // Function to add a new board column
  const addBoard = () => {
    const newColumn: Column = {
      id: `column-${Date.now()}`,
      title: 'New Board',
      icon: '📑',
      count: 0,
      tasks: []
    };

    setColumns([...columns, newColumn]);
  };

  // Function to handle drag start
  const handleDragStart = (e: React.DragEvent, taskId: string, columnId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('sourceColumnId', columnId);
  };

  // Function to handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Function to handle drop
  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    
    const taskId = e.dataTransfer.getData('taskId');
    const sourceColumnId = e.dataTransfer.getData('sourceColumnId');
    
    if (sourceColumnId === targetColumnId) return;
    
    // Find the task in the source column
    const sourceColumn = columns.find(col => col.id === sourceColumnId);
    if (!sourceColumn) return;
    
    const task = sourceColumn.tasks.find(task => task.id === taskId);
    if (!task) return;
    
    // Remove task from source column
    const updatedColumns = columns.map(column => {
      if (column.id === sourceColumnId) {
        return {
          ...column,
          tasks: column.tasks.filter(t => t.id !== taskId),
          count: column.count - 1
        };
      }
      if (column.id === targetColumnId) {
        return {
          ...column,
          tasks: [...column.tasks, task],
          count: column.count + 1
        };
      }
      return column;
    });
    
    setColumns(updatedColumns);
  };

  // Function to update task title
  const updateTaskTitle = (columnId: string, taskId: string, newTitle: string) => {
    setColumns(columns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: column.tasks.map(task => {
            if (task.id === taskId) {
              return {
                ...task,
                title: newTitle
              };
            }
            return task;
          })
        };
      }
      return column;
    }));
  };

  // Function to delete a task
  const deleteTask = (columnId: string, taskId: string) => {
    setColumns(columns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: column.tasks.filter(task => task.id !== taskId),
          count: column.count - 1
        };
      }
      return column;
    }));
  };

  // Function to move task from Todo to In Progress
  const moveToInProgress = (taskId: string) => {
    // Find the task in the Todo column
    const todoColumn = columns.find(col => col.id === 'todo');
    if (!todoColumn) return;
    
    const task = todoColumn.tasks.find(task => task.id === taskId);
    if (!task) return;
    
    // Remove task from Todo column and add to In Progress column
    const updatedColumns = columns.map(column => {
      if (column.id === 'todo') {
        return {
          ...column,
          tasks: column.tasks.filter(t => t.id !== taskId),
          count: column.count - 1
        };
      }
      if (column.id === 'in-progress') {
        return {
          ...column,
          tasks: [...column.tasks, task],
          count: column.count + 1
        };
      }
      return column;
    });
    
    setColumns(updatedColumns);
  };

  // Function to move task from In Progress to Done
  const moveToDone = (taskId: string) => {
    // Find the task in the In Progress column
    const inProgressColumn = columns.find(col => col.id === 'in-progress');
    if (!inProgressColumn) return;
    
    const task = inProgressColumn.tasks.find(task => task.id === taskId);
    if (!task) return;
    
    // Remove task from In Progress column and add to Done column
    const updatedColumns = columns.map(column => {
      if (column.id === 'in-progress') {
        return {
          ...column,
          tasks: column.tasks.filter(t => t.id !== taskId),
          count: column.count - 1
        };
      }
      if (column.id === 'done') {
        return {
          ...column,
          tasks: [...column.tasks, task],
          count: column.count + 1
        };
      }
      return column;
    });
    
    setColumns(updatedColumns);
  };

  // Helper function to get tag color classes
  const getTagColorClass = (color: string) => {
    switch (color) {
      case 'enhancement':
        return 'bg-purple-100 text-purple-800';
      case 'design':
        return 'bg-pink-100 text-pink-800';
      case 'bug':
        return 'bg-red-100 text-red-800';
      case 'devops':
        return 'bg-yellow-100 text-yellow-800';
      case 'done':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto py-10 px-4 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map(column => (
            <div 
              key={column.id}
              className="bg-gray-50 rounded-lg shadow"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="p-4 flex justify-between items-center border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <span>{column.icon}</span>
                  <h2 className="font-semibold">{column.title}</h2>
                  <span className="text-sm text-gray-500">{column.count}</span>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                {column.tasks.map(task => (
                  <Card 
                    key={task.id}
                    className="cursor-move"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id, column.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 w-full">
                          {column.id === 'todo' && (
                            <Checkbox 
                              id={`todo-${task.id}`}
                              className="mt-1"
                              onCheckedChange={() => moveToInProgress(task.id)}
                            />
                          )}
                          {column.id === 'in-progress' && (
                            <Checkbox 
                              id={`progress-${task.id}`}
                              className="mt-1"
                              onCheckedChange={() => moveToDone(task.id)}
                            />
                          )}
                          {column.id === 'done' && (
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                          )}
                          <div
                            className="font-medium w-full outline-none"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => updateTaskTitle(column.id, task.id, e.currentTarget.textContent || '')}
                          >
                            {task.title}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => deleteTask(column.id, task.id)}>
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {task.tags.map((tag, index) => (
                          <Badge 
                            key={index} 
                            variant="outline"
                            className={getTagColorClass(tag.color)}
                          >
                            {tag.text}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-gray-500"
                  onClick={() => addCard(column.id)}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Card
                </Button>
              </div>
            </div>
          ))}
          
          <div className="flex items-center justify-center h-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Button variant="ghost" onClick={addBoard}>
              <Plus className="h-4 w-4 mr-2" /> Add Board
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Planner;
