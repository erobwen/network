# Author 

Robert Renbris

# How to run

* npm install
* npm start

# Screenshot

![Alt text](/screenshot.png?raw=true "Screenshot")

# Design considerations. 

This app was built using BSP (binary space partition) for collision detection. 

## In place BSP sorting

To have a low space footprint, this BSP uses an in-place sorting algorith to sort the nodes into partitions within the array they reside. Nodes are sorted horizontally and vertically interchangeably in the same array. An external index is used for convenient access into the nodes placed in the original array. 

For binary partition in place, either horizointally or vertically, a modified version of the Quick sort algorithm was used. I had to modify the standard quick sort, to guarantee that all elements greater than or equal to the pivot element was placed in the lower partition for crisp borders, and that a higher partition had to be non-empty. This is because the partitions are layed out adjecant in the array with no space in between, and if one partition becomes empty, the other one has the size of its parent, causing infinite recursion.   

## Frame to frame optimization

Theoretically a BSP should speed up collision detection from O(n^2) to closer to O(log(n)). In practice I did not seem to measure any huge difference, from turning off BSP (by changing the node size limit so all dots go in the root). But I did not see a huge improvement with BSP with dot counts between 100-1000. Probably the overhead cost of reconstructing the BSP tree every frame eats up any benefit of having it.  

I had hoped that the partial sorting result from a frame would, would result in less work for the next frame. But given first that you interleave X and Y sorting, and the fact that the selection of pivot point for the sub-trees vary quite a lot from frame to frame, the partition is essentially re-done every frame even if it is in-place and fast.  

This was fun to implement, especially since I have never had a reason to build a BSP algorithm before. But in hindsight perhaps a static position quad tree spanning the entire canvas would be more suitable for the task, and it might perhaps be easier to reuse the structure from frame to frame.