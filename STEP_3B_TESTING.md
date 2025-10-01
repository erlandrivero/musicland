# Step 3B: Credits Management System - Testing Guide

## ✅ What's Been Completed

### 1. **React Query Integration**
- ✅ `@tanstack/react-query` installed and configured
- ✅ QueryProvider wrapper created
- ✅ 5-minute cache with automatic background refresh
- ✅ 30-second polling for real-time updates
- ✅ Integrated with SessionProvider

### 2. **Custom Hooks** (`hooks/use-credits.ts`)

#### `useCredits()`
- ✅ Fetches real credit balance from `/api/credits`
- ✅ Automatic polling every 30 seconds
- ✅ 5-minute cache with stale-while-revalidate
- ✅ Optimistic updates with rollback on error
- ✅ Low credit detection (< 10 credits)
- ✅ Percentage usage calculation

**Features:**
```typescript
const {
  credits,           // Current credit balance
  totalCredits,      // Total credits ever owned
  creditsUsed,       // Total credits used
  isLoading,         // Loading state
  isError,           // Error state
  isLowCredits,      // Boolean: credits < 10
  percentageUsed,    // Usage percentage
  hasCredits,        // Function: check if user has X credits
  deductCredits,     // Function: optimistic credit deduction
  refreshCredits,    // Function: manual refresh
} = useCredits();
```

#### `useCreditHistory()`
- ✅ Client-side usage tracking in localStorage
- ✅ Stores up to 100 usage records
- ✅ Daily/weekly/all-time statistics
- ✅ Usage breakdown by type

**Features:**
```typescript
const {
  getHistory,    // Get all usage records
  addUsage,      // Add new usage record
  clearHistory,  // Clear all history
  getStats,      // Get usage statistics
} = useCreditHistory();
```

#### `useCreditCalculator()`
- ✅ Calculate costs for different generation types
- ✅ Check if user can afford operations

### 3. **UI Components**

#### `CreditsBadge` - Compact credit display
- ✅ Shows current credit balance
- ✅ Color-coded (blue/amber for low credits)
- ✅ Refresh button
- ✅ Three sizes: sm, md, lg
- ✅ Error state handling

#### `CreditsDisplay` - Full credit dashboard
- ✅ Large credit balance display
- ✅ Visual progress bar
- ✅ Low credit warning banner
- ✅ Total credits and usage stats
- ✅ Refresh functionality
- ✅ Gradient design with animations

#### `CreditCostPreview` - Pre-generation cost calculator
- ✅ Shows cost breakdown
- ✅ Current balance vs. required credits
- ✅ Post-generation balance preview
- ✅ Insufficient credits warning
- ✅ Low credit warning (< 10 remaining)

#### `UsageHistory` - Transaction history
- ✅ List of all credit usage
- ✅ Categorized by type (generation, lyrics, stems)
- ✅ Timestamps and descriptions
- ✅ Clear history functionality
- ✅ Empty state

#### `UsageAnalytics` - Usage statistics
- ✅ Daily usage (last 24 hours)
- ✅ Weekly usage (last 7 days)
- ✅ All-time usage
- ✅ Usage breakdown by type with percentages
- ✅ Visual progress bars
- ✅ Empty state

#### `InsufficientCreditsModal` - Purchase flow
- ✅ Shows credit shortfall
- ✅ Displays pricing tiers
- ✅ Links to SunoAPI purchase page
- ✅ Current balance vs. required
- ✅ Professional modal design

### 4. **Credit Costs** (Based on SunoAPI)
```typescript
STANDARD_GENERATION: 10 credits    // Standard music generation
EXTENDED_GENERATION: 10 credits    // Extended generation
CUSTOM_MODE: 10 credits            // Custom mode
INSTRUMENTAL: 10 credits           // Instrumental only
LYRICS_ONLY: 2 credits             // Lyrics generation
STEM_SEPARATION: 10 credits        // Stem separation
```

### 5. **Pages Created**
- ✅ `/credits` - Full credits management dashboard

---

## 🧪 Testing Instructions

### Test 1: View Credits Dashboard

**Steps:**
1. Start development server: `npm run dev`
2. Sign in to the application
3. Navigate to: `http://localhost:3000/credits`

**Expected Results:**
- ✅ Credits display shows real balance from SunoAPI
- ✅ Progress bar reflects usage percentage
- ✅ Analytics show usage statistics
- ✅ History shows previous transactions (if any)

### Test 2: Real-Time Credit Updates

**Steps:**
1. Open credits page
2. Note current credit balance
3. Wait 30 seconds
4. Observe automatic refresh

**Expected Results:**
- ✅ Credits automatically refresh every 30 seconds
- ✅ No page reload required
- ✅ Smooth transition between updates

### Test 3: Manual Refresh

**Steps:**
1. On credits page, click refresh button
2. Observe loading state

**Expected Results:**
- ✅ Credits refresh immediately
- ✅ Loading indicator appears briefly
- ✅ Updated balance displays

### Test 4: Low Credit Warning

**Steps:**
1. If you have < 10 credits, view credits page
2. Observe warning banner

**Expected Results:**
- ✅ Amber/orange warning banner appears
- ✅ Warning message displays
- ✅ Badge turns amber color
- ✅ Progress bar changes to amber gradient

### Test 5: Credit Cost Preview

**Test in Browser Console:**
```javascript
// Import the component in your app first, then test
// This is a visual component test - add to a page to see it work
```

**Expected Results:**
- ✅ Shows accurate cost calculation
- ✅ Displays remaining balance after operation
- ✅ Warns if insufficient credits
- ✅ Warns if remaining credits < 10

### Test 6: Usage History Tracking

**Steps:**
1. Generate music (costs 10 credits)
2. Navigate to credits page
3. Check usage history

**Expected Results:**
- ✅ New transaction appears in history
- ✅ Shows correct cost (10 credits)
- ✅ Displays timestamp
- ✅ Categorized correctly

### Test 7: Usage Analytics

**Steps:**
1. After generating music, check analytics
2. Verify daily/weekly/total usage

**Expected Results:**
- ✅ Daily usage updates
- ✅ Weekly usage updates
- ✅ Total usage reflects all transactions
- ✅ Usage by type shows breakdown
- ✅ Percentages add up to 100%

### Test 8: Insufficient Credits Modal

**Test Component:**
```typescript
// Add to a page to test
import { InsufficientCreditsModal } from '@/components/credits';

const [showModal, setShowModal] = useState(false);

<InsufficientCreditsModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  requiredCredits={10}
/>
```

**Expected Results:**
- ✅ Modal shows credit shortfall
- ✅ Displays pricing tiers
- ✅ "Purchase Credits" button opens SunoAPI
- ✅ Cancel button closes modal

### Test 9: Error Handling

**Steps:**
1. Disconnect from internet
2. View credits page
3. Observe error state

**Expected Results:**
- ✅ Error message displays
- ✅ Retry button available
- ✅ No app crash
- ✅ Graceful degradation

### Test 10: Cache Behavior

**Steps:**
1. Load credits page
2. Navigate away
3. Return within 5 minutes
4. Observe instant load

**Expected Results:**
- ✅ Credits load instantly from cache
- ✅ Background refresh happens automatically
- ✅ No loading spinner on cached data

---

## 🔍 Integration Testing

### Test with Music Generation

**Complete Workflow:**
```javascript
// 1. Check credits before generation
const { credits, hasCredits } = useCredits();
console.log('Current credits:', credits);

// 2. Verify sufficient credits
if (!hasCredits(10)) {
  // Show insufficient credits modal
  console.log('Insufficient credits!');
}

// 3. Generate music (via API)
// Credits will be deducted on server

// 4. Refresh credits to see updated balance
await refreshCredits();

// 5. Add to usage history
addUsage('generation', 10, 'My awesome song');
```

**Expected Flow:**
1. ✅ Check shows current balance
2. ✅ Validation prevents generation if insufficient
3. ✅ Server deducts credits
4. ✅ Client refreshes and shows new balance
5. ✅ History records transaction

---

## 📊 Component Usage Examples

### Example 1: Add Credits Badge to Header

```typescript
// app/components/header.tsx
import { CreditsBadge } from '@/components/credits';

export function Header() {
  return (
    <header>
      <nav>
        {/* ... other nav items ... */}
        <CreditsBadge size="md" />
      </nav>
    </header>
  );
}
```

### Example 2: Show Cost Before Generation

```typescript
// app/generate/page.tsx
import { CreditCostPreview } from '@/components/credits';

export function GeneratePage() {
  return (
    <div>
      <CreditCostPreview 
        generationType="STANDARD_GENERATION"
        quantity={1}
      />
      <button>Generate Music</button>
    </div>
  );
}
```

### Example 3: Check Credits Before Action

```typescript
import { useCredits } from '@/hooks/use-credits';

function GenerateButton() {
  const { hasCredits, deductCredits } = useCredits();
  const [showModal, setShowModal] = useState(false);

  const handleGenerate = async () => {
    if (!hasCredits(10)) {
      setShowModal(true);
      return;
    }

    // Optimistic update
    deductCredits(10);

    // Make API call
    await generateMusic();
  };

  return (
    <>
      <button onClick={handleGenerate}>
        Generate Music
      </button>
      <InsufficientCreditsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        requiredCredits={10}
      />
    </>
  );
}
```

---

## 🐛 Troubleshooting

### Issue: Credits not updating
**Solution:**
1. Check if user is authenticated
2. Verify `/api/credits` endpoint is working
3. Check browser console for errors
4. Try manual refresh

### Issue: History not saving
**Solution:**
1. Check localStorage is enabled
2. Verify browser allows localStorage
3. Check for quota exceeded errors
4. Try clearing history and starting fresh

### Issue: Analytics showing wrong data
**Solution:**
1. Clear localStorage: `localStorage.removeItem('credit_usage_history')`
2. Refresh page
3. Generate new transactions

### Issue: Polling not working
**Solution:**
1. Check React Query is properly configured
2. Verify user is authenticated
3. Check network tab for API calls
4. Ensure component is mounted

---

## ✅ Verification Checklist

### Real API Integration
- [ ] Credits fetch from real SunoAPI endpoint
- [ ] Balance updates after generation
- [ ] No mock or fake data used
- [ ] Error responses handled properly

### UI Components
- [ ] CreditsBadge displays correctly
- [ ] CreditsDisplay shows all information
- [ ] CreditCostPreview calculates accurately
- [ ] UsageHistory lists transactions
- [ ] UsageAnalytics shows statistics
- [ ] InsufficientCreditsModal appears when needed

### Functionality
- [ ] Automatic polling works (30s interval)
- [ ] Manual refresh works
- [ ] Low credit warnings appear
- [ ] Optimistic updates work
- [ ] Error states display properly
- [ ] Cache works (5-minute stale time)

### User Experience
- [ ] Loading states are smooth
- [ ] Animations are professional
- [ ] Colors match design system
- [ ] Mobile responsive
- [ ] Accessible (ARIA labels)

---

## 📈 Performance Metrics

- **Initial Load:** < 500ms (with cache)
- **Refresh Time:** < 1s
- **Polling Interval:** 30s
- **Cache Duration:** 5 minutes
- **localStorage Limit:** 100 records

---

## 🎯 Next Steps

After verifying Step 3B:

**Step 4: Music Generation Interface**
- Generation form with real-time validation
- Model selection (chirp-v3-5 to chirp-v5)
- Custom vs. non-custom mode toggle
- Real-time generation status
- Audio player integration

---

## 📝 Notes

- **All credit data is real** - fetched from SunoAPI
- **Polling is automatic** - updates every 30 seconds
- **History is local** - stored in browser localStorage
- **Cache is smart** - 5-minute stale time with background refresh
- **Optimistic updates** - instant UI feedback with rollback on error

---

## 🔗 Related Documentation

- `API_DOCUMENTATION.md` - API endpoint reference
- `STEP_3A_TESTING.md` - API integration testing
- `hooks/use-credits.ts` - Hook implementation details
- `components/credits/` - Component source code
