# Author 

Robert Renbris

# How to run

* npm install
* npm start

# Design considerations. 

This app was built using BSP (binary space partition) for collision detection. 

The BSP used an in-place sorting algorith to sort the nodes into partitions in the array they reside, to be space efficient. An external index is used for convenient access into the nodes placed in the original array. 

For binary partition in place, either horizointally or vertically, a modified version of the Quick sort algorithm was used. I had to modify the standard quick sort, so that it had to guarantee that elements greater than or equal to the pivot element was placed in the lower partition, and that a higher partition had to exist, because the partitions are layed out adjecant in the array with no space in between.   

Although the algorithm was successfully implelemented, some performance testing suggests that it was not that important for the overall performance to 

An improved algorithm could perhaps reuse the previous index tree when rebuilding an index for the next loop cycle. This could perhaps also investigate ways to attach pivot points to actual dots, so that the binary partition tree rebuilds more consistently, reducing the need to move around dots in the array.   