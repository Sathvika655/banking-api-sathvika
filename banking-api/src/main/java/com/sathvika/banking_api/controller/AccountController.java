package com.sathvika.banking_api.controller;

import com.sathvika.banking_api.entity.Account;
import com.sathvika.banking_api.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:3000")
public class AccountController {

    @Autowired
    private AccountRepository accountRepository;

    @GetMapping
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Account> getAccountById(@PathVariable Long id) {
        Optional<Account> account = accountRepository.findById(id);
        return account.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/deposit/{accountNumber}/{amount}")
    public ResponseEntity<String> deposit(@PathVariable String accountNumber, @PathVariable Double amount) {
        Optional<Account> accountOpt = accountRepository.findByAccountNumber(accountNumber);
        if (accountOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("❌ Account not found: " + accountNumber);
        }

        Account account = accountOpt.get();
        account.setBalance(account.getBalance() + amount);
        accountRepository.save(account);
        return ResponseEntity.ok("✅ Deposited $" + amount + " | New balance: $" + account.getBalance());
    }

    @PostMapping("/withdraw/{accountNumber}/{amount}")
    public ResponseEntity<String> withdraw(@PathVariable String accountNumber, @PathVariable Double amount) {
        Optional<Account> accountOpt = accountRepository.findByAccountNumber(accountNumber);
        if (accountOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("❌ Account not found: " + accountNumber);
        }

        Account account = accountOpt.get();
        if (account.getBalance() < amount) {
            return ResponseEntity.badRequest().body("❌ Insufficient balance: $" + account.getBalance());
        }

        account.setBalance(account.getBalance() - amount);
        accountRepository.save(account);
        return ResponseEntity.ok("✅ Withdrew $" + amount + " | New balance: $" + account.getBalance());
    }
}









