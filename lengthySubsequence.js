const lengthSubSeq = (sequence) => {
  if (sequence.length === 0) return 0;

  const dp = new Array(sequence.length).fill(1);
  // Build the DP array
  for (let i = 1; i < sequence.length; i++) {
    for (let j = 0; j < i; j++) {
        if (sequence[i] > sequence[j]) {
            dp[i] = Math.max(dp[i], dp[j] + 1);
        }
    }
}

// The length of the longest increasing subsequence
return Math.max(...dp);
};
console.log(lengthSubSeq([10, 9, 2, 5, 3, 7, 101, 18]));
