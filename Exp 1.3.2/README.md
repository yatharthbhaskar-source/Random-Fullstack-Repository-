# CC-2-exp6 (24BDA70041)
## Problem Statement:84.Largest Rectangle in Histogram
class Solution:

    def largestRectangleArea(self, heights):
        stack = []
        maxArea = 0
        heights.append(0)
        for i in range(len(heights)):
            while stack and heights[stack[-1]] > heights[i]:
                h = heights[stack.pop()]
                if stack:
                    w = i - stack[-1] - 1
                else:
                    w = i
                maxArea = max(maxArea, h * w)
            stack.append(i)
        return maxArea