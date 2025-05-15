# Create backup of original file if it doesn't already exist
if (-Not (Test-Path "E:\vs_code\pbl_os\memviz\src\App.tsx.bak")) {
    Copy-Item -Path "E:\vs_code\pbl_os\memviz\src\App.tsx" -Destination "E:\vs_code\pbl_os\memviz\src\App.tsx.bak" -Force
} else {
    # Restore from backup to start fresh
    Copy-Item -Path "E:\vs_code\pbl_os\memviz\src\App.tsx.bak" -Destination "E:\vs_code\pbl_os\memviz\src\App.tsx" -Force
}

# Read the content
$content = Get-Content -Path "E:\vs_code\pbl_os\memviz\src\App.tsx" -Raw

# Fix type null error on line 524 by adding a null check
$oldLine = 'log(`Error: Process P${processIdToRemove} has inconsistent allocation data. Index: ${processToRemove.allocatedBlockIndex}. Block: ${memoryBlocksRef.current[processToRemove.allocatedBlockIndex] ? JSON.stringify(memoryBlocksRef.current[processToRemove.allocatedBlockIndex]) : ''N/A''}`);'
$newLine = 'log(`Error: Process P${processIdToRemove} has inconsistent allocation data. Index: ${processToRemove.allocatedBlockIndex}. Block: ${processToRemove.allocatedBlockIndex !== null && memoryBlocksRef.current[processToRemove.allocatedBlockIndex] ? JSON.stringify(memoryBlocksRef.current[processToRemove.allocatedBlockIndex]) : ''N/A''}`);'
$content = $content.Replace($oldLine, $newLine)

# Fix the Label component missing htmlFor prop
$oldLine = '<Label className="!mb-1">Process List ({processes.length})</Label>'
$newLine = '<Label htmlFor="process-list" className="!mb-1">Process List ({processes.length})</Label>'
$content = $content.Replace($oldLine, $newLine)

# Fix the showAlert function to be wrapped in useCallback
$oldLine = '  const showAlert = (title: string, description: string) => {
    setAlertDialog({ open: true, title, description });
  };'
$newLine = '  const showAlert = useCallback((title: string, description: string) => {
    setAlertDialog({ open: true, title, description });
  }, []);'
$content = $content.Replace($oldLine, $newLine)

# Fix the useCallback hooks missing finalizeAllocation dependency
$oldLine1 = '  }, [log]);

  const allocateBestFit'
$newLine1 = '  }, [log, finalizeAllocation]);

  const allocateBestFit'
$content = $content.Replace($oldLine1, $newLine1)

$oldLine2 = '  }, [log]);

  const allocateWorstFit'
$newLine2 = '  }, [log, finalizeAllocation]);

  const allocateWorstFit'
$content = $content.Replace($oldLine2, $newLine2)

$oldLine3 = '  }, [log]);

  const deallocateMemory'
$newLine3 = '  }, [log, finalizeAllocation]);

  const deallocateMemory'
$content = $content.Replace($oldLine3, $newLine3)

# Save the modified content
Set-Content -Path "E:\vs_code\pbl_os\memviz\src\App.tsx" -Value $content
