# Author 

Robert Renbris

# How to run

* npm install
* npm start

# Design considerations. 

This app was built using BSP (binary space partition) for collision detection. 

To have a low space footprint, this BSP uses an in-place sorting algorith to sort the nodes into partitions within the array they reside. Nodes are sorted horizontally and vertically interchangeably in the same array. An external index is used for convenient access into the nodes placed in the original array. 

For binary partition in place, either horizointally or vertically, a modified version of the Quick sort algorithm was used. I had to modify the standard quick sort, to guarantee that all elements greater than or equal to the pivot element was placed in the lower partition, and that a higher partition had to be non-empty. This is because the partitions are layed out adjecant in the array with no space in between, and if one partition becomes empty, the other one has the size of its parent, causing infinite recursion.   

Also, I had hoped that the partial sorting result from the previous screen, would result in less work for the current screen. But given that you interleave X and Y, sorting, and the fact that the selection of pivot point for the sub-trees vary quite a lot from frame to frame, that does not seem to be the case and the partition is essentially re-done every frame.  

This was fun to implement, especially since I have never had a reason to build a BSP algorithm before. But in hindsight perhaps a static position quad tree spanning the entire canvas would be more suitable for the task? Then perhaps it might be easier find optimizations between frames when nodes stay relativley local. 