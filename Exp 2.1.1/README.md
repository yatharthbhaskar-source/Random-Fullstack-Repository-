# CC-2-exp9 (24BDA70041)
## Problem Statement:78. Subsets
class Solution:

    def subsets(self, nums):
        result = []

        def backtrack(index, current):
            result.append(current[:])

            for i in range(index, len(nums)):
                current.append(nums[i])
                backtrack(i + 1, current)
                current.pop()

        backtrack(0, [])

        return result